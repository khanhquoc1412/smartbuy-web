const Product = require('../models/product');
const ProductVariant = require('../models/product_variant');

exports.health = (req, res) => {
  res.json({ success: true, service: 'product-service', timestamp: new Date().toISOString() });
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
        id: String(d._id),
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
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};


