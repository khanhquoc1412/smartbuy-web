const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { User, Product, ProductImage, Brand, sequelize, Category, Specification, ProductSpecification, ProductVariant, Color, Memory } = require('../database/models')
const { comparePassword, jwtCreate, jwtVerify } = require('../utils')
const { jwtDecodeToken } = require('../utils/jwt')
const { Op, where } = require("sequelize");
const { cloudinary } = require('../services/cloudinary')
const { queryCondition } = require('../utils/queryCondition')
const { NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError } = require('../errors')

const getAll = async (req, res, next) => {
    try {
        // test loading FE
        await new Promise(resolve => setTimeout(resolve, 500));
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // sort options
        const { order, dir } = req.query
        const sort = (order && dir) ? [[order, dir]] : []
        // query conditions
        const categoryCondition = queryCondition(req.params?.categoryName, 'name');
        const brandCondition = queryCondition(req.query?.brand, 'nameAscii')
        let productCondition = {}
        if (req.params?.keyword) {
            productCondition = {
                name: {
                    [Op.like]: `%${req.params?.keyword}%`
                }
            }
        }
        console.log(req.params?.keyword)

        const { rows, count } = await Product.findAndCountAll({
            attributes: [
                'id',
                'name',
                'description',
                'discountPercentage',
                'thumbUrl',
                'slug',
                'basePrice',
                [sequelize.literal('`brand`.`name`'), 'brandName'],
                [sequelize.literal('`category`.`name`'), 'categoryName'],
            ],
            include: [
                {
                    model: Brand,
                    as: 'brand',
                    attributes: [],
                    where: brandCondition
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: [],
                    where: categoryCondition,
                }
            ],
            where: productCondition,
            order: sort,
            offset,
            limit,
            distinct: true,
        })
        totalPages = Math.ceil(count / limit);
        data = rows;
        total = count;
        return res.status(StatusCodes.OK).json({
            products: data,
            total: totalPages,
            skip: offset,
            limit,
            page
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const createProduct = async (req, res, next) => {
    try {
        const { name,
            description,
            thumbUrl,
            basePrice,
            brandId,
            discountPercentage,
            categoryId
        } = req.body
        const product = await Product.create({
            name,
            description,
            thumbUrl,
            basePrice,
            brandId,
            discountPercentage,
            categoryId
        });
        return res.status(StatusCodes.CREATED).json({
            product,
            message: 'Thêm thành công sản phẩm',
            status: StatusCodes.CREATED
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}
const getProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const product = await Product.findOne({
            attributes: [
                'id',
                'name',
                'description',
                'discountPercentage',
                'thumbUrl',
                'slug',
                'basePrice',
                [sequelize.literal('brand.name'), 'brandName'],
                [sequelize.literal('category.name'), 'categoryName'],
            ],
            include: [
                {
                    model: Brand,
                    as: 'brand',
                    attributes: []
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: [],
                },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['name', 'imageUrl']
                },
                {
                    model: ProductSpecification,
                    as: 'productSpecs',
                    attributes: ['specValue'],
                    include: [
                        {
                            model: Specification,
                            as: 'specification',
                            attributes: ['specName'],
                        }
                    ]
                },
                {
                    model: ProductVariant,
                    as: 'productVariants',
                    attributes: ['id', 'stock', 'price'],
                    include: [
                        {
                            model: Color,
                            as: 'color',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        },
                        {
                            model: Memory,
                            as: 'memory',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        },
                    ]
                }
            ],
            where: { slug }
        })
        return res.status(StatusCodes.OK).json(product)
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const getProductVariant = async (req, res, next) => {
    try {
        const { id } = req.params
        const productVariant = await ProductVariant.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Color,
                    as: 'color',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: Memory,
                    as: 'memory',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: [
                        'id',
                        'name',
                        'description',
                        'discountPercentage',
                        'thumbUrl',
                        'slug',
                        'basePrice',
                    ]
                }
            ],
            where: { id }
        })
        return res.status(StatusCodes.OK).json(productVariant)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const updateProduct = async (req, res, next) => {

}

const deleteProduct = async (req, res, next) => {

}

const addImageProduct = async (req, res) => {
    try {
        const {
            productId,
        } = req.body

        const product = await Product.findOne({
            attributes: ['id', 'name'],
            where: {
                id: productId
            }
        })
        for (const file of req.files) {

            try {
                const uploadResponse = await cloudinary.uploader.upload('src/uploads/' + file.filename, {
                    upload_preset: 'dshop'
                });
                console.log(uploadResponse)

                if (file.fieldname === 'thumbUrl') {
                    const imageUrl = cloudinary.url(uploadResponse.public_id, {
                        width: 600,
                        height: 600,
                        crop: "fill",
                        fetch_format: "auto"
                    });
                    await product.update({
                        thumbUrl: imageUrl
                    })
                } else {
                    const imageUrl = cloudinary.url(uploadResponse.public_id, {
                        width: 1200,
                        height: 570,
                        crop: "fill",
                        fetch_format: "auto"
                    });

                    console.log(imageUrl)
                    const newImage = {
                        productId: productId,
                        imageUrl: imageUrl,
                        name: uploadResponse.original_filename,
                        originalName: uploadResponse.original_filename,
                    }
                    await ProductImage.create(newImage)
                }
            } catch (error) {
                console.log(error)
                return res.status(500).json({ error: "Upload error" })
            }
        }

        res.status(200).json({ ok: product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Add error" })
    }
}

const getProductSale = async (req, res, next) => {
    try {
        const { quantity } = req.query
        const { rows, count } = await Product.findAndCountAll({
            attributes: [
                'id',
                'name',
                'description',
                'discountPercentage',
                'thumbUrl',
                'slug',
                'basePrice',
            ],
            offset: 0,
            limit: parseInt(quantity),
            distinct: true,
        })
        data = rows;
        total = count;
        return res.status(StatusCodes.OK).json({
            products: data,
            total: 1,
            skip: 0,
            limit: parseInt(quantity),
            page: 1
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}
module.exports = {
    getAll,
    createProduct,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    getProductSale,
    getProductVariant,
    addImageProduct
}