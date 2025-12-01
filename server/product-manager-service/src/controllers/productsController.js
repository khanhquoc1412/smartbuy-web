const Product = require('../models/product');
const ProductVariant = require('../models/product_variant');
const ProductImage = require('../models/product_image');
const ProductSpecification = require('../models/product_specification');

exports.health = (req, res) => {
  res.json({ success: true, service: 'product-service', timestamp: new Date().toISOString() });
};

/**
 * Search products for chatbot
 * Query params: brand, priceRange, category, color, memory, minPrice, maxPrice, keyword, limit
 */
exports.search = async (req, res) => {
  try {
    const { brand, priceRange, category, color, memory, minPrice, maxPrice, keyword, limit = 10 } = req.query;

    console.log('🔍 Chatbot search params:', { brand, priceRange, category, color, memory, minPrice, maxPrice, keyword, limit });

    // Build filter
    const filter = {};

    // Search by keyword (name or slug)
    if (keyword) {
      filter.$or = [
        { name: new RegExp(keyword, 'i') },
        { slug: new RegExp(keyword, 'i') }
      ];
    }

    // Match brand (case-insensitive)
    if (brand) {
      const Brand = require('../models/brand');
      const brandDoc = await Brand.findOne({ name: new RegExp(brand, 'i') });
      if (brandDoc) filter.brand = brandDoc._id;
    }

    // Match category (case-insensitive)
    if (category) {
      const Category = require('../models/category');
      const categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
      if (categoryDoc) filter.category = categoryDoc._id;
    }

    // Price range mapping (string-based)
    const priceRanges = {
      // Khoảng giá cụ thể
      '3-5-trieu': { $gte: 3000000, $lt: 5000000 },
      '5-10-trieu': { $gte: 5000000, $lt: 10000000 },
      '10-15-trieu': { $gte: 10000000, $lt: 15000000 },
      '15-20-trieu': { $gte: 15000000, $lt: 20000000 },
      '20-30-trieu': { $gte: 20000000, $lt: 30000000 },
      // Dưới X triệu (entity value)
      'duoi-3-trieu': { $lt: 3000000 },
      'duoi-5-trieu': { $lt: 5000000 },
      'duoi-10-trieu': { $lt: 10000000 },
      'duoi-15-trieu': { $lt: 15000000 },
      'duoi-20-trieu': { $lt: 20000000 },
      'duoi-30-trieu': { $lt: 30000000 },
      // Trên X triệu (entity value)
      'tren-20-trieu': { $gte: 20000000 },
      'tren-30-trieu': { $gte: 30000000 },
      // Text tự do fallback (nếu entity không match)
      'dưới 3 triệu': { $lt: 3000000 },
      'dưới 5 triệu': { $lt: 5000000 },
      'dưới 10 triệu': { $lt: 10000000 },
      'dưới 15 triệu': { $lt: 15000000 },
      'dưới 20 triệu': { $lt: 20000000 },
      'dưới 30 triệu': { $lt: 30000000 },
      'trên 20 triệu': { $gte: 20000000 },
      'trên 30 triệu': { $gte: 30000000 }
    };

    if (priceRange && priceRanges[priceRange]) {
      filter.basePrice = priceRanges[priceRange];
    }

    // Price filter (number-based) - has higher priority than priceRange
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = parseInt(minPrice);
      if (maxPrice) filter.basePrice.$lte = parseInt(maxPrice);
    }

    console.log('📊 MongoDB filter:', JSON.stringify(filter));

    // If color filter is provided, find colorId first
    let colorId = null;
    if (color) {
      const Color = require('../models/color');
      const colorDoc = await Color.findOne({ name: new RegExp(color, 'i') });
      if (colorDoc) {
        colorId = colorDoc._id;
        console.log(`🎨 Found color: ${colorDoc.name} (${colorId})`);
      } else {
        console.log(`⚠️ Color "${color}" not found in database`);
        // Return empty result if color doesn't exist
        return res.json({
          success: true,
          data: {
            products: [],
            total: 0
          }
        });
      }
    }

    // If memory filter is provided, find memoryId first
    let memoryId = null;
    if (memory) {
      const Memory = require('../models/memory');

      // DEBUG: Log all available memories
      const allMemories = await Memory.find({}).select('rom ram _id');
      console.log('🔍 Available memories in database:', allMemories.map(m => ({ rom: m.rom, ram: m.ram, id: String(m._id) })));

      // Normalize memory: "512gb" -> "512GB", "4gb-ram" -> "4GB"
      const normalizedMemory = memory.replace(/\s/g, '').toUpperCase();
      console.log(`🔍 Searching for memory: "${memory}" -> normalized: "${normalizedMemory}"`);

      let memoryDoc = null;

      // Check if searching for RAM (contains "RAM" suffix)
      if (normalizedMemory.includes('RAM') || normalizedMemory.includes('-RAM')) {
        // Extract RAM value: "4GB-RAM" -> "4GB"
        const ramValue = normalizedMemory.replace(/-?RAM$/i, '');
        console.log(`🔍 Searching for RAM: "${ramValue}"`);

        memoryDoc = await Memory.findOne({
          ram: new RegExp(`^${ramValue}$`, 'i')
        });

        if (memoryDoc) {
          memoryId = memoryDoc._id;
          console.log(`💾 Found memory by RAM: ROM=${memoryDoc.rom}, RAM=${memoryDoc.ram} (${memoryId})`);
        }
      } else {
        // Search by ROM field (storage capacity like "512GB")
        memoryDoc = await Memory.findOne({
          rom: new RegExp(`^${normalizedMemory}$`, 'i')
        });

        if (memoryDoc) {
          memoryId = memoryDoc._id;
          console.log(`💾 Found memory by ROM: ROM=${memoryDoc.rom}, RAM=${memoryDoc.ram} (${memoryId})`);
        }
      }

      if (!memoryDoc) {
        console.log(`⚠️ Memory "${memory}" not found in database`);
        // Return empty result if memory doesn't exist
        return res.json({
          success: true,
          data: {
            products: [],
            total: 0
          }
        });
      }
    }

    // Aggregate with lookup
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandDoc'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDoc'
        }
      },
      {
        $lookup: {
          from: 'productvariants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: [{ $toString: '$productId' }, { $toString: '$$productId' }] }
                  ]
                }
              }
            },
            // Filter by colorId if provided (ObjectId reference)
            ...(colorId ? [{
              $match: {
                colorId: colorId
              }
            }] : []),
            // Filter by memoryId if provided (ObjectId reference)
            ...(memoryId ? [{
              $match: {
                memoryId: memoryId
              }
            }] : [])
          ],
          as: 'variants'
        }
      },
      // Only keep products that have matching color variants
      ...(colorId ? [{ $match: { 'variants.0': { $exists: true } } }] : []),
      // Only keep products that have matching memory variants
      ...(memoryId ? [{ $match: { 'variants.0': { $exists: true } } }] : []),
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          basePrice: 1,
          discountPercentage: 1,
          thumbUrl: 1,
          brand: { $arrayElemAt: ['$brandDoc.name', 0] },
          category: { $arrayElemAt: ['$categoryDoc.name', 0] },
          variants: 1,
          // Calculate total stock from all variants
          totalStock: { $sum: '$variants.stock' },
          // Calculate selling price: basePrice - (basePrice * discountPercentage / 100)
          sellingPrice: {
            $subtract: [
              '$basePrice',
              {
                $multiply: [
                  '$basePrice',
                  { $divide: [{ $ifNull: ['$discountPercentage', 0] }, 100] }
                ]
              }
            ]
          }
        }
      },
      { $limit: parseInt(limit) }
    ];

    const products = await Product.aggregate(pipeline);

    console.log(`✅ Found ${products.length} products`);

    res.json({
      success: true,
      data: {
        products: products.map(p => ({
          _id: String(p._id),
          slug: p.slug || '',
          name: p.name,
          price: Math.round(p.sellingPrice || p.basePrice), // Use calculated selling price
          basePrice: p.basePrice,
          discount: p.discountPercentage || 0,
          brand: p.brand || '',
          category: p.category || '',
          image: p.thumbUrl || '',
          inStock: (p.totalStock || 0) > 0, // Check if total stock > 0
          stock: p.totalStock || 0,
          variants: p.variants || []
        })),
        total: products.length
      }
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { name: new RegExp(q, 'i') } : {};

    const pipeline = [
      { $match: filter },

      // Lookup brands và categories với field mới
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand'
        }
      },

      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },

      // Lookup product variants để tính tổng stock
      {
        $lookup: {
          from: 'productvariants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: [{ $toString: '$productId' }, { $toString: '$$productId' }] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalStock: { $sum: '$stock' }
              }
            }
          ],
          as: 'stockInfo'
        }
      },

      {
        $project: {
          name: 1,
          basePrice: 1,
          createdAt: 1,
          updatedAt: 1,
          brandName: { $ifNull: [{ $arrayElemAt: ['$brand.name', 0] }, ''] },
          categoryName: { $ifNull: [{ $arrayElemAt: ['$category.name', 0] }, ''] },
          stock: { $ifNull: [{ $arrayElemAt: ['$stockInfo.totalStock', 0] }, 0] }
        }
      },

      { $sort: { updatedAt: -1 } }
    ];

    const docs = await Product.aggregate(pipeline);

    const items = docs.map((d) => {
      const created = d.createdAt || (d._id && d._id.getTimestamp && d._id.getTimestamp()) || null;
      const updated = d.updatedAt || created;
      const status = (d.stock || 0) > 0 ? 'Còn hàng' : 'Hết hàng';
      return {
        _id: String(d._id),  // MongoDB _id
        id: String(d._id),   // Alias cho compatibility
        name: d.name,
        brand: d.brandName,
        category: d.categoryName,
        price: d.basePrice,
        status,
        stock: d.stock || 0,
        created_at: created ? new Date(created).toLocaleDateString('vi-VN') : '',
        updated_at: updated ? new Date(updated).toLocaleDateString('vi-VN') : '',
      };
    });

    res.json({ success: true, items });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await Product.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const productId = req.params.id;

    console.log('🗑️ Deleting product and related data:', productId);

    // 1. Xóa tất cả ProductVariants của sản phẩm
    const deletedVariants = await ProductVariant.deleteMany({ productId });
    console.log(`  ✅ Deleted ${deletedVariants.deletedCount} variants`);

    // 2. Xóa tất cả ProductImages của sản phẩm
    const deletedImages = await ProductImage.deleteMany({ productId });
    console.log(`  ✅ Deleted ${deletedImages.deletedCount} images`);

    // 3. Xóa tất cả ProductSpecifications của sản phẩm
    const deletedSpecs = await ProductSpecification.deleteMany({ productId });
    console.log(`  ✅ Deleted ${deletedSpecs.deletedCount} specifications`);

    // 4. Cuối cùng xóa Product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('  ✅ Deleted product');

    res.json({
      success: true,
      message: 'Product and all related data deleted successfully',
      deletedCount: {
        variants: deletedVariants.deletedCount,
        images: deletedImages.deletedCount,
        specifications: deletedSpecs.deletedCount
      }
    });
  } catch (e) {
    console.error('❌ Error deleting product:', e);
    res.status(400).json({ success: false, message: e.message });
  }
};

// Upload thumbnail cho product
exports.uploadThumb = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    console.log('📤 Upload thumb request:');
    console.log('  - productId:', id);
    console.log('  - file:', file);

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Lưu relative path
    const thumbUrl = `/uploads/${file.filename}`;

    console.log('✅ Thumb saved at:', thumbUrl);

    // Update product với thumbUrl
    const product = await Product.findByIdAndUpdate(
      id,
      { thumbUrl: thumbUrl },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      item: product,
      thumbUrl: thumbUrl
    });
  } catch (error) {
    console.error('Error uploading thumb:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



