const Product = require('../models/product');
const ProductVariant = require('../models/product_variant');
const Category = require('../models/category');

/**
 * GET /api/products/stats/top-selling
 * Lấy top sản phẩm bán chạy
 * Note: Cần data từ Order để có số lượng bán thực tế
 * Tạm thời trả về top products theo giá
 */
exports.getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // TODO: Cần join với Order collection để lấy số lượng bán thực
    // Tạm thời lấy top products có variants nhiều nhất hoặc giá cao
    const topProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'productvariants',
          localField: '_id',
          foreignField: 'productId',
          as: 'variants'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandInfo'
        }
      },
      {
        $unwind: { path: '$brandInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $addFields: {
          totalStock: { 
            $sum: {
              $map: {
                input: '$variants',
                as: 'variant',
                in: { $ifNull: ['$$variant.stock', 0] }
              }
            }
          },
          avgPrice: { $avg: '$variants.price' },
          variantCount: { $size: '$variants' }
        }
      },
      {
        $sort: { totalStock: -1, avgPrice: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          name: 1,
          thumbUrl: 1,
          brand: '$brandInfo.name',
          category: '$categoryInfo.name',
          avgPrice: 1,
          totalStock: 1,
          // Mock số lượng đã bán (sẽ được thay bằng data thật từ Order)
          sold: { $multiply: ['$totalStock', 0.3] }, // Giả sử đã bán 30% stock
          revenue: { $multiply: ['$avgPrice', { $multiply: ['$totalStock', 0.3] }] }
        }
      }
    ]);

    res.json({
      success: true,
      data: topProducts.map(p => ({
        productId: p._id,
        name: p.name,
        image: p.thumbUrl,
        brand: p.brand,
        category: p.category,
        sold: Math.round(p.sold),
        revenue: Math.round(p.revenue),
        stock: p.totalStock // Thêm stock vào response
      }))
    });
  } catch (error) {
    console.error('Error in getTopSellingProducts:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/products/stats/by-category
 * Lấy doanh thu theo danh mục
 */
exports.getRevenueByCategory = async (req, res) => {
  try {
    const categoryStats = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $unwind: { path: '$products', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'productvariants',
          localField: 'products._id',
          foreignField: 'productId',
          as: 'variants'
        }
      },
      {
        $unwind: { path: '$variants', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$_id',
          categoryName: { $first: '$name' },
          totalProducts: { $addToSet: '$products._id' },
          totalStock: { $sum: '$variants.stock' },
          avgPrice: { $avg: '$variants.price' }
        }
      },
      {
        $addFields: {
          productCount: { $size: '$totalProducts' },
          // Mock revenue: giả sử bán được 30% stock
          estimatedRevenue: { 
            $multiply: [
              '$avgPrice', 
              { $multiply: ['$totalStock', 0.3] }
            ] 
          }
        }
      },
      {
        $sort: { estimatedRevenue: -1 }
      },
      {
        $project: {
          category: '$categoryName',
          productCount: 1,
          totalStock: 1,
          revenue: { $round: ['$estimatedRevenue', 0] }
        }
      }
    ]);

    res.json({
      success: true,
      data: categoryStats.map(cat => ({
        category: cat.category,
        productCount: cat.productCount,
        revenue: cat.revenue || 0
      }))
    });
  } catch (error) {
    console.error('Error in getRevenueByCategory:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/products/stats/inventory
 * Lấy thống kê tồn kho: low/normal/high stock
 */
exports.getInventoryStatus = async (req, res) => {
  try {
    const { lowThreshold = 10, highThreshold = 40 } = req.query;

    const inventoryStats = await ProductVariant.aggregate([
      {
        $group: {
          _id: null,
          lowStock: {
            $sum: { $cond: [{ $lt: ['$stock', parseInt(lowThreshold)] }, 1, 0] }
          },
          normalStock: {
            $sum: { 
              $cond: [
                { 
                  $and: [
                    { $gte: ['$stock', parseInt(lowThreshold)] },
                    { $lt: ['$stock', parseInt(highThreshold)] }
                  ]
                }, 
                1, 
                0
              ] 
            }
          },
          highStock: {
            $sum: { $cond: [{ $gte: ['$stock', parseInt(highThreshold)] }, 1, 0] }
          },
          totalVariants: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    // Lấy danh sách sản phẩm sắp hết hàng (stock < lowThreshold)
    const lowStockProducts = await ProductVariant.find({ 
      stock: { $lt: parseInt(lowThreshold) } 
    })
      .populate('productId', 'name thumbUrl')
      .populate('colorId', 'name')
      .populate('memoryId', 'ram rom')
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    const stats = inventoryStats[0] || {
      lowStock: 0,
      normalStock: 0,
      highStock: 0,
      totalVariants: 0,
      totalStock: 0
    };

    // Format danh sách sản phẩm sắp hết hàng
    const formattedProducts = lowStockProducts.map(variant => {
      const memoryText = variant.memoryId 
        ? `${variant.memoryId.ram || ''} ${variant.memoryId.rom || ''}`.trim() 
        : 'N/A';
      
      return {
        _id: variant._id,
        productId: variant.productId?._id || null,
        name: variant.productId?.name || 'N/A',
        sku: `${variant.productId?._id?.toString().slice(-6)}-${variant._id.toString().slice(-4)}`,
        color: variant.colorId?.name || 'N/A',
        memory: memoryText,
        stock: variant.stock,
        price: variant.price,
        image: variant.productId?.thumbUrl || ''
      };
    });

    res.json({
      success: true,
      data: {
        lowStock: stats.lowStock,
        normalStock: stats.normalStock,
        highStock: stats.highStock,
        totalVariants: stats.totalVariants,
        totalStock: stats.totalStock,
        lowStockProducts: formattedProducts,
        thresholds: {
          low: parseInt(lowThreshold),
          high: parseInt(highThreshold)
        }
      }
    });
  } catch (error) {
    console.error('Error in getInventoryStatus:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/products/stats/overview
 * Lấy tổng quan sản phẩm
 */
exports.getProductsOverview = async (req, res) => {
  try {
    const [productCount, categoryCount, variantStats] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      ProductVariant.aggregate([
        {
          $group: {
            _id: null,
            totalVariants: { $sum: 1 },
            totalStock: { $sum: '$stock' },
            avgPrice: { $avg: '$price' },
            totalValue: { $sum: { $multiply: ['$stock', '$price'] } }
          }
        }
      ])
    ]);

    const variants = variantStats[0] || {
      totalVariants: 0,
      totalStock: 0,
      avgPrice: 0,
      totalValue: 0
    };

    res.json({
      success: true,
      data: {
        totalProducts: productCount,
        totalCategories: categoryCount,
        totalVariants: variants.totalVariants,
        totalStock: variants.totalStock,
        avgPrice: Math.round(variants.avgPrice),
        totalInventoryValue: Math.round(variants.totalValue)
      }
    });
  } catch (error) {
    console.error('Error in getProductsOverview:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
