const { StatusCodes } = require('http-status-codes')
const Product = require('../models/product.model')
const { cloudinary } = require('../services/cloudinary')

// GET /api/product/get-all? page,limit,order,dir,brand,category
const getAll = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit
		const { order, dir, brand, category } = req.query
		const { categoryName, keyword } = req.params || {}

		const sort = {}
		if (order && dir) sort[order] = String(dir).toLowerCase() === 'desc' ? -1 : 1

		const filter = {}
		if (brand) filter.brandName = brand
		if (category || categoryName) filter.categoryName = category || categoryName
		if (keyword) filter.name = { $regex: keyword, $options: 'i' }

		const [items, total] = await Promise.all([
			Product.find(filter)
				.select('name description discountPercentage thumbUrl slug basePrice brandName categoryName')
				.sort(sort)
				.skip(skip)
				.limit(limit),
			Product.countDocuments(filter)
		])

		return res.status(StatusCodes.OK).json({
			products: items,
			total: Math.ceil(total / limit),
			skip,
			limit,
			page
		})
	} catch (error) {
		console.error(error)
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lỗi server' })
	}
}

// POST /api/product/create
const createProduct = async (req, res) => {
	try {
		const body = req.body
		const product = await Product.create(body)
		return res.status(StatusCodes.CREATED).json({
			product,
			message: 'Thêm thành công sản phẩm'
		})
	} catch (error) {
		console.error(error)
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lỗi server' })
	}
}

// GET /api/product/:slug
const getProductBySlug = async (req, res) => {
	try {
		const { slug } = req.params
		const product = await Product.findOne({ slug })
			.select('name description discountPercentage thumbUrl slug basePrice brandName categoryName images productSpecs productVariants')
		if (!product) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy sản phẩm' })
		return res.status(StatusCodes.OK).json(product)
	} catch (error) {
		console.error(error)
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lỗi server' })
	}
}

// GET /api/product/variant/:id
const getProductVariant = async (req, res) => {
	try {
		const { id } = req.params
		const product = await Product.findOne({ 'productVariants._id': id })
			.select('name description discountPercentage thumbUrl slug basePrice productVariants')
		if (!product) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy biến thể' })
		const variant = product.productVariants.id(id)
		return res.status(StatusCodes.OK).json({ ...variant.toObject(), product: product.toObject() })
	} catch (error) {
		console.error(error)
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lỗi server' })
	}
}

// GET /api/product/sale?quantity=4
const getProductSale = async (req, res) => {
	try {
		const quantity = parseInt(req.query.quantity) || 4
		const products = await Product.find({})
			.select('name description discountPercentage thumbUrl slug basePrice')
			.limit(quantity)
		return res.status(StatusCodes.OK).json({
			products,
			total: 1,
			skip: 0,
			limit: quantity,
			page: 1
		})
	} catch (error) {
		console.error(error)
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lỗi server' })
	}
}

// POST /api/product/add/image (multipart)
const addImageProduct = async (req, res) => {
	try {
		const { productId } = req.body
		const product = await Product.findById(productId).select('_id name thumbUrl')
		if (!product) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy sản phẩm' })

		for (const file of req.files || []) {
			const uploadResponse = await cloudinary.uploader.upload('src/uploads/' + file.filename, {
				upload_preset: 'dshop'
			})
			if (file.fieldname === 'thumbUrl') {
				const imageUrl = cloudinary.url(uploadResponse.public_id, {
					width: 600,
					height: 600,
					crop: 'fill',
					fetch_format: 'auto'
				})
				product.thumbUrl = imageUrl
			} else {
				const imageUrl = cloudinary.url(uploadResponse.public_id, {
					width: 1200,
					height: 570,
					crop: 'fill',
					fetch_format: 'auto'
				})
				product.images.push({
					imageUrl,
					name: uploadResponse.original_filename,
					originalName: uploadResponse.original_filename
				})
			}
		}
		await product.save()
		return res.status(StatusCodes.OK).json({ ok: product })
	} catch (error) {
		console.error(error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Upload error' })
	}
}

module.exports = {
	getAll,
	createProduct,
	getProductBySlug,
	getProductVariant,
	getProductSale,
	addImageProduct
}

