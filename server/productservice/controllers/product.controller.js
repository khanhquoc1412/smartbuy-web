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
// const axios = require('axios');

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
// getall - kiếm được tất cả sản phẩm với brand và category populated
// const getAll = async (req, res, next) => {
//   const products = await Product.find().populate("brand category");
//   const productsWithVariants = [];
//   for (const product of products) {
//     const images = await ProductImage.find({ productId: product._id });
//     const variants = await ProductVariant.find({ productId: product._id })
//       .populate({ path: "colorId", select: "name" })
//       .populate({ path: "memoryId", select: "ram rom" });

//     productsWithVariants.push({
//       id: product._id,
//       name: product.name,
//       slug: product.slug,
//       basePrice: product.basePrice,
//       discountPercentage: product.discountPercentage,
//       thumbUrl: product.thumbUrl,
//       productVariants: variants.map((variant) => ({
//         id: variant._id,
//         color: variant.colorId
//           ? { id: variant.colorId._id, name: variant.colorId.name }
//           : null,
//         memory: variant.memoryId
//           ? { id: variant.memoryId._id, ram: variant.memoryId.ram, rom: variant.memoryId.rom }
//           : null,
//         price: variant.price,
//         stock: variant.stock,
//       })),
//       images: images.map((img) => ({
//         _id: img._id,
//         colorId: img.colorId,
//         imageUrl: img.imageUrl,
//         name: img.name,
//       })),
//     });
//   }
//   res.status(StatusCodes.OK).json({
//     products: productsWithVariants,
//     total: productsWithVariants.length,
//     skip: 0,
//     limit: productsWithVariants.length,
//     page: 1,
//   });
// };

// getall -kiếm được thương hiệu ở trang mobile
// const getAll = async (req, res, next) => {
//   try {
//     // ⚙️ Lấy tham số phân trang & sắp xếp
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;
//     const skip = (page - 1) * limit;

//     const { order, dir, brand: brandQuery } = req.query;
//     const sort = order ? { [order]: dir === "desc" ? -1 : 1 } : {};

//     // 🎯 Điều kiện tìm kiếm
//     const productCondition = {};

//     // 🔍 Lọc theo keyword (tên sản phẩm)
//     const keyword =
//       req.params?.keyword?.trim() || req.query?.keyword?.trim() || null;
//     if (keyword) {
//       productCondition.name = { $regex: new RegExp(keyword, "i") };
//     }

//     // 📂 Lọc theo category
//     if (req.params?.categoryName) {
//       const categoryParam = req.params.categoryName.trim();
//       const category = await Category.findOne({
//         $or: [
//           { nameAscii: new RegExp(categoryParam, "i") },
//           { name: new RegExp(categoryParam, "i") },
//         ],
//       });

//       if (category) {
//         productCondition.$or = [
//           { categoryId: category._id },
//           { category: category.name },
//           { category: category.nameAscii },
//         ];
//       }
//     }

//     // 🏷️ Lọc theo brand
//     let unresolvedBrandFilter = null;
//     if (brandQuery) {
//       console.log("brandQuery:", brandQuery);
//       const brand = await Brand.findOne({
//         $or: [
//           { nameAscii: new RegExp(brandQuery, "i") },
//           { name: new RegExp(brandQuery, "i") },
//         ],
//       });

//       if (brand) {
//         // 🔍 Tìm các sản phẩm khớp theo brand ID hoặc tên brand
//         const idMatches = await Product.find({
//           $or: [{ brandId: brand._id }, { brand: brand._id }],
//         })
//           .select("_id")
//           .lean();

//         const strMatches = await Product.collection
//           .find({
//             brand: { $regex: new RegExp(brand.name, "i") },
//           })
//           .project({ _id: 1 })
//           .toArray();

//         // Gộp tất cả _id trùng
//         const ids = new Set();
//         idMatches.forEach((d) => ids.add(String(d._id)));
//         strMatches.forEach((d) => ids.add(String(d._id)));

//         if (ids.size > 0) {
//           productCondition._id = { $in: Array.from(ids) };
//         } else {
//           // fallback nếu không có id nào match
//           productCondition.$or = productCondition.$or || [];
//           productCondition.$or.push(
//             { brandId: brand._id },
//             { brand: brand._id }
//           );
//         }

//         console.log("✅ resolved brand:", brand._id.toString());
//       } else {
//         // brand không có trong collection → lọc sau khi query
//         unresolvedBrandFilter = new RegExp(brandQuery, "i");
//         console.warn(
//           `⚠️ Brand "${brandQuery}" not found → filtering in-memory`
//         );
//       }
//     }

//     // 🧩 Lấy sản phẩm (populate brand, category)
//     const products = await Product.find(productCondition)
//       .populate("brand")
//       .populate("category")
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // 🔍 Nếu brand không có trong Brand collection, lọc bằng regex thủ công
//     const filteredProducts = unresolvedBrandFilter
//       ? products.filter((p) => {
//           const combined = `${p.brand?.name || ""} ${
//             p.brand?.nameAscii || ""
//           } ${p.brand || ""}`.trim();
//           return unresolvedBrandFilter.test(combined);
//         })
//       : products;

//     // 🧱 Thêm variants & images
//     const productsWithVariants = [];
//     for (const p of filteredProducts) {
//       const images = await ProductImage.find({ productId: p._id }).lean();
//       const variants = await ProductVariant.find({ productId: p._id })
//         .populate({ path: "colorId", select: "name" })
//         .populate({ path: "memoryId", select: "ram rom" })
//         .lean();

//       productsWithVariants.push({
//         id: p._id,
//         name: p.name,
//         description: p.description,
//         slug: p.slug,
//         basePrice: p.basePrice,
//         discountPercentage: p.discountPercentage,
//         thumbUrl: p.thumbUrl,
//         brandName: p.brand?.name || p.brand || null,
//         categoryName: p.category?.name || p.category || null,
//         productVariants: variants.map((v) => ({
//           id: v._id,
//           price: v.price,
//           stock: v.stock,
//           color: v.colorId ? { id: v.colorId._id, name: v.colorId.name } : null,
//           memory: v.memoryId
//             ? {
//                 id: v.memoryId._id,
//                 ram: v.memoryId.ram,
//                 rom: v.memoryId.rom,
//               }
//             : null,
//         })),
//         images: images.map((img) => ({
//           _id: img._id,
//           colorId: img.colorId,
//           imageUrl: img.imageUrl,
//           name: img.name,
//         })),
//       });
//     }

//     // 📤 Trả về dữ liệu
//     res.status(StatusCodes.OK).json({
//       products: productsWithVariants,
//       total: productsWithVariants.length,
//       skip,
//       limit,
//       page,
//     });
//   } catch (error) {
//     console.error("getAll error:", error);
//     res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Lỗi server",
//       detail: error.message,
//     });
//   }
// };

// const getAll = async (req, res, next) => {
//   console.log("🔍 getAll called:", {
//     params: req.params,
//     query: req.query,
//     path: req.path,
//   });

//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;
//     const skip = (page - 1) * limit;
//     const { order, dir, brand: brandQuery, category: categoryQuery } = req.query;
//     const sort = order ? { [order]: dir === "desc" ? -1 : 1 } : {};

//     const escapeRegex = (s = "") => new RegExp(String(s).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");

//     const brandField = "brand";
//     const categoryField = "category";

//     const productCondition = {};

//     // Keyword filter
//     const keyword = req.params?.keyword || req.query?.keyword;
//     if (keyword) productCondition.name = { $regex: escapeRegex(String(keyword)) };

//     // Category filter (from route param /category/:categoryName or query)
//     let unresolvedCategoryRegex = null;
//     const categoryParam = req.params?.categoryName || categoryQuery;
//     if (categoryParam) {
//       const cp = String(categoryParam).trim();
//       const catDoc = await Category.findOne({
//         $or: [{ nameAscii: new RegExp(cp, "i") }, { name: new RegExp(cp, "i") }],
//       }).lean();

//       console.log("📂 Category lookup:", {
//         param: cp,
//         found: catDoc ? { _id: catDoc._id, name: catDoc.name } : null
//       });

//       if (catDoc) {
//         productCondition[categoryField] = catDoc._id;
//         const count = await Product.countDocuments({ [categoryField]: catDoc._id });
//         console.log(`📊 Products with category "${catDoc.name}": ${count}`);
//       } else {
//         unresolvedCategoryRegex = escapeRegex(cp.replace(/-/g, " "));
//         console.warn(`⚠️ Category "${cp}" not found → will filter in-memory`);
//       }
//     }

//     // Brand filter (from query ?brand=apple)
//     let unresolvedBrandRegex = null;
//     if (typeof brandQuery === "string" && brandQuery.trim() !== "") {
//       const bq = brandQuery.trim();
//       const brandDoc = await Brand.findOne({
//         $or: [{ nameAscii: new RegExp(bq, "i") }, { name: new RegExp(bq, "i") }],
//       }).lean();

//       console.log("🏷️ Brand lookup:", {
//         param: bq,
//         found: brandDoc ? { _id: brandDoc._id, name: brandDoc.name } : null
//       });

//       if (brandDoc) {
//         productCondition[brandField] = brandDoc._id;
//       } else {
//         unresolvedBrandRegex = escapeRegex(bq);
//         console.warn(`⚠️ Brand "${bq}" not found → will filter in-memory`);
//       }
//     }

//     console.log("🔎 Final productCondition:", productCondition);

//     let products = [];
//     let totalItems = 0;

//     if (unresolvedBrandRegex || unresolvedCategoryRegex) {
//       const candidates = await Product.find(productCondition)
//         .populate({ path: brandField, select: "name nameAscii" })
//         .populate({ path: categoryField, select: "name nameAscii" })
//         .sort(sort)
//         .lean();

//       let filtered = candidates;
//       if (unresolvedBrandRegex) {
//         filtered = filtered.filter((p) => {
//           const val = p[brandField];
//           const name = typeof val === "string" ? val : (val && (val.name || val.nameAscii)) || "";
//           return unresolvedBrandRegex.test(String(name));
//         });
//       }
//       if (unresolvedCategoryRegex) {
//         filtered = filtered.filter((p) => {
//           const val = p[categoryField];
//           const name = typeof val === "string" ? val : (val && (val.name || val.nameAscii)) || "";
//           return unresolvedCategoryRegex.test(String(name));
//         });
//       }

//       totalItems = filtered.length;
//       products = filtered.slice(skip, skip + limit);
//     } else {
//       totalItems = await Product.countDocuments(productCondition);
//       products = await Product.find(productCondition)
//         .populate({ path: brandField, select: "name nameAscii" })
//         .populate({ path: categoryField, select: "name nameAscii" })
//         .sort(sort)
//         .skip(skip)
//         .limit(limit)
//         .lean();
//     }

//     // Attach variants + images
//     const productsWithVariants = [];
//     for (const p of products) {
//       const images = await ProductImage.find({ productId: p._id }).lean();
//       const variants = await ProductVariant.find({ productId: p._id })
//         .populate({ path: "colorId", select: "name" })
//         .populate({ path: "memoryId", select: "ram rom" })
//         .lean();

//       productsWithVariants.push({
//         id: String(p._id),
//         _id: p._id,
//         name: p.name,
//         slug: p.slug,
//         description: p.description,
//         basePrice: p.basePrice,
//         discountPercentage: p.discountPercentage,
//         thumbUrl: p.thumbUrl,
//         brandName: (p[brandField] && (p[brandField].name || p[brandField])) || null,
//         categoryName: (p[categoryField] && (p[categoryField].name || p[categoryField])) || null,
//         productVariants: variants.map((v) => ({
//           id: String(v._id),
//           _id: v._id,
//           price: v.price,
//           stock: v.stock,
//           color: v.colorId ? { id: String(v.colorId._id), name: v.colorId.name } : null,
//           memory: v.memoryId ? { id: String(v.memoryId._id), ram: v.memoryId.ram, rom: v.memoryId.rom } : null,
//         })),
//         images: images.map((img) => ({
//           id: String(img._id),
//           _id: img._id,
//           colorId: img.colorId,
//           imageUrl: img.imageUrl,
//           name: img.name,
//         })),
//       });
//     }

//     const totalPages = Math.max(1, Math.ceil(totalItems / limit));

//     console.log("✅ getAll result:", {
//       page,
//       limit,
//       totalItems,
//       totalPages,
//       returnedItems: productsWithVariants.length,
//     });

//     return res.status(StatusCodes.OK).json({
//       products: productsWithVariants,
//       total: totalPages,
//       page,
//       limit,
//       skip,
//     });
//   } catch (error) {
//     console.error("❌ getAll error:", error);
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Lỗi server",
//       detail: error.message,
//     });
//   }
// };

const getAll = async (req, res, next) => {
  console.log("🔍 getAll called:", {
    params: req.params,
    query: req.query,
    path: req.path,
  });

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const {
      order,
      dir,
      brand: brandQuery,
      category: categoryQuery,
    } = req.query;
    const sort = order ? { [order]: dir === "desc" ? -1 : 1 } : {};

    const escapeRegex = (s = "") =>
      new RegExp(String(s).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");

    const brandField = "brand";
    const categoryField = "category";

    const productCondition = {};

    // ✅ Keyword filter
    const keyword = req.params?.keyword || req.query?.keyword;
    if (keyword)
      productCondition.name = { $regex: escapeRegex(String(keyword)) };

    // ✅ Category filter
    let unresolvedCategoryRegex = null;
    const categoryParam = req.params?.categoryName || categoryQuery;
    if (categoryParam) {
      const cp = String(categoryParam).trim();
      const catDoc = await Category.findOne({
        $or: [
          { nameAscii: new RegExp(cp, "i") },
          { name: new RegExp(cp, "i") },
        ],
      }).lean();

      console.log("📂 Category lookup:", {
        param: cp,
        found: catDoc ? { _id: catDoc._id, name: catDoc.name } : null,
      });

      if (catDoc) {
        productCondition[categoryField] = catDoc._id;
      } else {
        unresolvedCategoryRegex = escapeRegex(cp.replace(/-/g, " "));
        console.warn(`⚠️ Category "${cp}" not found → will filter in-memory`);
      }
    }

    // ✅ Brand filter
    let unresolvedBrandRegex = null;
    if (typeof brandQuery === "string" && brandQuery.trim() !== "") {
      const bq = brandQuery.trim();
      const brandDoc = await Brand.findOne({
        $or: [
          { nameAscii: new RegExp(bq, "i") },
          { name: new RegExp(bq, "i") },
        ],
      }).lean();

      console.log("🏷️ Brand lookup:", {
        param: bq,
        found: brandDoc ? { _id: brandDoc._id, name: brandDoc.name } : null,
      });

      if (brandDoc) {
        productCondition[brandField] = brandDoc._id;
      } else {
        unresolvedBrandRegex = escapeRegex(bq);
        console.warn(`⚠️ Brand "${bq}" not found → will filter in-memory`);
      }
    }

    console.log("🔎 Final productCondition:", productCondition);

    // ✅ Fetch products với/không có filter in-memory
    let products = [];
    let totalItems = 0;

    if (unresolvedBrandRegex || unresolvedCategoryRegex) {
      // Trường hợp cần filter sau khi query (brand/category không có trong DB)
      const candidates = await Product.find(productCondition)
        .populate({ path: brandField, select: "name nameAscii" })
        .populate({ path: categoryField, select: "name nameAscii" })
        .sort(sort)
        .lean();

      let filtered = candidates;
      if (unresolvedBrandRegex) {
        filtered = filtered.filter((p) => {
          const val = p[brandField];
          const name =
            typeof val === "string"
              ? val
              : (val && (val.name || val.nameAscii)) || "";
          return unresolvedBrandRegex.test(String(name));
        });
      }
      if (unresolvedCategoryRegex) {
        filtered = filtered.filter((p) => {
          const val = p[categoryField];
          const name =
            typeof val === "string"
              ? val
              : (val && (val.name || val.nameAscii)) || "";
          return unresolvedCategoryRegex.test(String(name));
        });
      }

      totalItems = filtered.length;
      products = filtered.slice(skip, skip + limit);
    } else {
      // Trường hợp query trực tiếp DB
      totalItems = await Product.countDocuments(productCondition);
      products = await Product.find(productCondition)
        .populate({ path: brandField, select: "name nameAscii" })
        .populate({ path: categoryField, select: "name nameAscii" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    }

    // ✅ Attach variants + images cho từng sản phẩm
    const productsWithVariants = [];
    for (const p of products) {
      const images = await ProductImage.find({ productId: p._id }).lean();
      const variants = await ProductVariant.find({ productId: p._id })
        .populate({ path: "colorId", select: "name" })
        .populate({ path: "memoryId", select: "ram rom" })
        .lean();

      productsWithVariants.push({
        id: String(p._id),
        _id: p._id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        discountPercentage: p.discountPercentage,
        thumbUrl: p.thumbUrl,
        brandName:
          (p[brandField] && (p[brandField].name || p[brandField])) || null,
        categoryName:
          (p[categoryField] && (p[categoryField].name || p[categoryField])) ||
          null,
        productVariants: variants.map((v) => ({
          id: String(v._id),
          _id: v._id,
          price: v.price,
          stock: v.stock,
          color: v.colorId
            ? { id: String(v.colorId._id), name: v.colorId.name }
            : null,
          memory: v.memoryId
            ? {
                id: String(v.memoryId._id),
                ram: v.memoryId.ram,
                rom: v.memoryId.rom,
              }
            : null,
        })),
        images: images.map((img) => ({
          id: String(img._id),
          _id: img._id,
          colorId: img.colorId,
          imageUrl: img.imageUrl,
          name: img.name,
        })),
      });
    }

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    console.log("✅ getAll result:", {
      page,
      limit,
      totalItems,
      totalPages,
      returnedItems: productsWithVariants.length,
    });

    return res.status(StatusCodes.OK).json({
      products: productsWithVariants,
      total: totalPages, // Frontend cần totalPages cho pagination
      totalItems, // Thêm totalItems để debug
      page,
      limit,
      skip,
    });
  } catch (error) {
    console.error("❌ getAll error:", error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      detail: error.message,
    });
  }
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

// const getProductVariant = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // ví dụ nếu bạn có model ProductVariant
//     const variant = await ProductVariant.findById(id);
//     if (!variant) return res.status(404).json({ message: "Variant not found" });
//     res.status(StatusCodes.OK).json(variant);
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ message: "Error fetching variant" });
//   }
// };
const getProductVariant = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting variant by ID:", id);

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const variant = await ProductVariant.findById(id)
      .populate("productId")
      .populate("colorId")
      .populate("memoryId")
      .lean();

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    console.log("✅ Variant found");

    res.status(200).json({
      success: true,
      data: {
        _id: variant._id,
        productId: variant.productId?._id,
        price: variant.price,
        stock: variant.stock,
        colorId: variant.colorId,
        memoryId: variant.memoryId,
      },
    });
  } catch (error) {
    console.error("❌ Error getting variant:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting product by ID:", id);

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    // ✅ Tìm product và populate đầy đủ
    const product = await Product.findById(id)
      .populate("brand")
      .populate("category")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Lấy thêm variants, images, specs
    const [variants, images, productSpecs] = await Promise.all([
      ProductVariant.find({ productId: product._id })
        .populate("colorId")
        .populate("memoryId")
        .lean(),
      ProductImage.find({ productId: product._id }).lean(),
      ProductSpecification.find({ productId: product._id })
        .populate("specsId")
        .lean(),
    ]);

    // ✅ Format response
    const formattedProduct = {
      _id: product._id,
      id: String(product._id),
      name: product.name,
      description: product.description,
      slug: product.slug,
      basePrice: product.basePrice,
      discountPercentage: product.discountPercentage,
      thumbUrl: product.thumbUrl,
      brandName: product.brand?.name,
      categoryName: product.category?.name,
      productVariants: variants.map((v) => ({
        _id: v._id,
        id: String(v._id),
        price: v.price,
        stock: v.stock,
        colorId: v.colorId,
        memoryId: v.memoryId,
      })),
      images: images.map((img) => ({
        _id: img._id,
        colorId: img.colorId,
        imageUrl: img.imageUrl,
        name: img.name,
      })),
      productSpecs: productSpecs.map((spec) => ({
        specValue: spec.specValue,
        specification: spec.specsId,
      })),
    };

    console.log("✅ Product found:", product.name);

    res.status(200).json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("❌ Error getting product by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// // Lấy review cho sản phẩm theo slug
// const getProductReviewsBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params;
//     // Gọi sang review-service (giả sử chạy ở http://localhost:5006)
//     const response = await axios.get(`http://localhost:5006/api/reviews/product/${slug}`, {
//       params: req.query // truyền các query như page, limit, sort
//     });
//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching product reviews:', error.message);
//     return res.status(500).json({ success: false, message: 'Không thể lấy đánh giá sản phẩm' });
//   }
// };

module.exports = {
  getAll,
  createProduct,
  updateProduct,
  deleteProduct,
  addImageProduct,
  getProductSale,
  getProductBySlug, // ✅ export thêm
  getProductVariant,
  getProductById, // ✅ export thêm
  // getProductReviewsBySlug, // Thêm controller getProductReviewsBySlug
};
