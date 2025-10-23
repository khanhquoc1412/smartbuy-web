const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");
const ProductImage = require("../models/product_image");
const ProductSpecification = require("../models/product_specification");
const ProductVariant = require("../models/product_variant");
const Specification = require("../models/specification");
const Color = require("../models/color");
const Memory = require("../models/memory");
const { NotFoundError, BadRequestError } = require("../errors");
const { cloudinary } = require("../services/cloudinary");

// const getAll = async (req, res, next) => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const { order, dir } = req.query;
//     const sort = order && dir ? { [order]: dir } : {};

//     const categoryCondition = req.params?.categoryName
//       ? { name: new RegExp(req.params.categoryName, "i") }
//       : {};
//     const brandCondition = req.query?.brand
//       ? { nameAscii: new RegExp(req.query.brand, "i") }
//       : {};
//     let productCondition = {};
//     if (req.params?.keyword) {
//       productCondition = { name: new RegExp(req.params.keyword, "i") };
//     }

//     const [brands, categories] = await Promise.all([
//       Brand.find(brandCondition),
//       Category.find(categoryCondition),
//     ]);

//     const products = await Product.find(productCondition)
//       .populate("brand")
//       .populate("category")
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     const count = await Product.countDocuments(productCondition);
//     const totalPages = Math.ceil(count / limit);
//     for (const product of products) {
//     const images = await ProductImage.find({ productId: product._id });
//     // ...xử lý tiếp...
//   }
//     res.status(StatusCodes.OK).json({
//       products: products.map((p) => ({
//         id: p._id,
//         name: p.name,
//         description: p.description,
//         discountPercentage: p.discountPercentage,
//         thumbUrl: p.thumbUrl,
//         slug: p.slug,
//         basePrice: p.basePrice,
//         brandName: p.brand?.name,
//         categoryName: p.category?.name,
//       })),
//       total: totalPages,
//       skip,
//       limit,
//       page,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Lỗi server",
//       status: StatusCodes.BAD_REQUEST,
//     });
//   }
// };
const getAll = async (req, res, next) => {
  const products = await Product.find().populate("brand category");
  const productsWithVariants = [];
  for (const product of products) {
    const images = await ProductImage.find({ productId: product._id });
    const variants = await ProductVariant.find({ productId: product._id })
      .populate("colorId")
      .populate("memoryId");
    productsWithVariants.push({
      id: product._id,
      name: product.name,
      slug: product.slug,
      basePrice: product.basePrice,
      discountPercentage: product.discountPercentage,
      thumbUrl: product.thumbUrl,
      productVariants: variants.map(variant => ({
        id: variant._id,
        color: {
          id: variant.colorId?._id,
          name: variant.colorId?.name,
        },
        memory: {
          id: variant.memoryId?._id,
          rom: variant.memoryId?.rom,
        },
        price: variant.price,
        stock: variant.stock,
      })),
      images: images.map(img => ({
        _id: img._id,
        colorId: img.colorId,
        imageUrl: img.imageUrl,
        name: img.name,
      })),
    });
  }
  res.status(StatusCodes.OK).json({
    products: productsWithVariants,
    total: productsWithVariants.length,
    skip: 0,
    limit: productsWithVariants.length,
    page: 1,
  });
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      thumbUrl,
      basePrice,
      brandId,
      discountPercentage,
      categoryId,
    } = req.body;
    const product = await Product.create({
      name,
      description,
      thumbUrl,
      basePrice,
      brandId,
      discountPercentage,
      categoryId,
    });
    res.status(StatusCodes.CREATED).json({
      product,
      message: "Product created successfully",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Cannot create product",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      thumbUrl,
      basePrice,
      brandId,
      discountPercentage,
      categoryId,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        thumbUrl,
        basePrice,
        brandId,
        discountPercentage,
        categoryId,
      },
      { new: true }
    );
    if (!product) throw new NotFoundError("Product not found");
    res.status(StatusCodes.OK).json({
      product,
      message: "Product updated successfully",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new NotFoundError("Product not found");
    res.status(StatusCodes.OK).json({
      message: "Product deleted successfully",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

const addImageProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");

    for (const file of req.files) {
      const uploadResponse = await cloudinary.uploader.upload(
        "src/uploads/" + file.filename,
        {
          upload_preset: "dshop",
        }
      );

      if (file.fieldname === "thumbUrl") {
        const imageUrl = cloudinary.url(uploadResponse.public_id, {
          width: 600,
          height: 600,
          crop: "fill",
          fetch_format: "auto",
        });
        await product.updateOne({ thumbUrl: imageUrl });
      } else {
        const imageUrl = cloudinary.url(uploadResponse.public_id, {
          width: 1200,
          height: 570,
          crop: "fill",
          fetch_format: "auto",
        });
        const newImage = new ProductImage({
          productId,
          imageUrl,
          name: uploadResponse.original_filename,
          originalName: uploadResponse.original_filename,
        });
        await newImage.save();
      }
    }

    res.status(StatusCodes.OK).json({ ok: product });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Add error" });
  }
};

const getProductSale = async (req, res, next) => {
  try {
    const { quantity } = req.query;
    const products = await Product.find()
      .limit(parseInt(quantity) || 10)
      .select("id name description discountPercentage thumbUrl slug basePrice");

    res.status(StatusCodes.OK).json({
      products,
      total: 1,
      skip: 0,
      limit: parseInt(quantity) || 10,
      page: 1,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const ProductImage = require("../models/product_image");
    const ProductSpecification = require("../models/product_specification");
    const ProductVariant = require("../models/product_variant");

    // Tìm sản phẩm theo slug
    const product = await Product.findOne({ slug })
      .populate("brand")
      .populate("category");

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Lấy thêm thông tin từ các collection liên quan
    const [images, productSpecs, productVariants] = await Promise.all([
      // Lấy hình ảnh sản phẩm
      ProductImage.find({ productId: product._id }),

      // Lấy thông số kỹ thuật
      ProductSpecification.find({ productId: product._id }).populate({
        path: "specsId",
        select: "specName",
      }),

      // Lấy biến thể sản phẩm
      ProductVariant.find({ productId: product._id })
        .populate("colorId")
        .populate("memoryId"),
    ]);

    // Chuyển đổi product thành object để có thể thêm các thuộc tính mới
    const productData = product.toObject();

    // Đảm bảo categoryName được thiết lập đúng
    productData.categoryName = product.category?.name;

    // Thêm images vào product
    productData.images = images.map((img) => ({
      _id: img._id, // Thêm dòng này
      colorId: img.colorId,
      imageUrl: img.imageUrl,
      name: img.name || img.originalName || "Product Image",
    }));

    // Thêm productSpecs vào product
    productData.productSpecs = productSpecs.map((spec) => ({
      specValue: spec.specValue,
      specification: {
        specName: spec.specsId.specName,
        _id: spec.specsId._id,
      },
    }));

    // Thêm productVariants vào product với cấu trúc đúng cho frontend
    productData.productVariants = productVariants.map((variant) => ({
      id: variant._id,
      stock: variant.stock,
      price: variant.price,
      color: {
        id: variant.colorId._id,
        name: variant.colorId.name,
      },
      memory: {
        id: variant.memoryId._id,
        ram: variant.memoryId.ram,
        rom: variant.memoryId.rom,
      },
    }));

    // Đảm bảo basePrice được thiết lập đúng
    if (!productData.basePrice && productVariants.length > 0) {
      productData.basePrice = productVariants[0].price;
    }

    // Log để debug
    console.log(
      "Product data:",
      JSON.stringify({
        hasImages: productData.images.length > 0,
        hasVariants: productData.productVariants.length > 0,
        basePrice: productData.basePrice,
        discountPercentage: productData.discountPercentage,
      })
    );

    res.status(StatusCodes.OK).json(productData);
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Error fetching product" });
  }
};

const getProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    // ví dụ nếu bạn có model ProductVariant
    const variant = await ProductVariant.findById(id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    res.status(StatusCodes.OK).json(variant);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Error fetching variant" });
  }
};

module.exports = {
  getAll,
  createProduct,
  updateProduct,
  deleteProduct,
  addImageProduct,
  getProductSale,
  getProductBySlug, // ✅ export thêm
  getProductVariant, // ✅ export thêm
};
