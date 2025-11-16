const ProductVariant = require('../models/product_variant');

// GET /api/products/:productId/variants - Lấy tất cả variants của sản phẩm
exports.listByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.find({ productId })
      .populate('colorId', 'name code')
      .populate('memoryId', 'ram rom chipset')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      items: variants,
      total: variants.length
    });
  } catch (error) {
    console.error('Error fetching product variants:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:productId/variants/:id - Lấy variant theo ID
exports.getById = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id)
      .populate('colorId', 'name code')
      .populate('memoryId', 'ram rom chipset');
    
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }
    res.json({ success: true, data: variant });
  } catch (error) {
    console.error('Error fetching variant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/:productId/variants - Tạo variant mới
exports.create = async (req, res) => {
  try {
    const { productId } = req.params;
    const { colorId, memoryId, price, stock } = req.body;
    
    const variant = new ProductVariant({
      productId,
      colorId,
      memoryId,
      price: price || 0,
      stock: stock || 0
    });
    
    await variant.save();
    await variant.populate('colorId', 'name code');
    await variant.populate('memoryId', 'ram rom chipset');
    
    res.status(201).json({ success: true, data: variant });
  } catch (error) {
    console.error('Error creating variant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:productId/variants/:id - Cập nhật variant
exports.update = async (req, res) => {
  try {
    const { colorId, memoryId, price, stock } = req.body;
    
    const variant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      { colorId, memoryId, price, stock },
      { new: true, runValidators: true }
    )
      .populate('colorId', 'name code')
      .populate('memoryId', 'ram rom chipset');
    
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }
    
    res.json({ success: true, data: variant });
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:productId/variants/:id - Xóa variant
exports.delete = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndDelete(req.params.id);
    
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }
    
    res.json({ success: true, message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/variants/:variantId/release-stock - Trả lại kho (khi hủy đơn)
exports.releaseStock = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { qty } = req.body;

    if (!qty || qty <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số lượng không hợp lệ' 
      });
    }

    const variant = await ProductVariant.findById(variantId);
    
    if (!variant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy variant' 
      });
    }

    // Cộng lại kho
    variant.stock += qty;
    await variant.save();

    console.log(`✅ Đã trả ${qty} sản phẩm vào kho. Stock hiện tại: ${variant.stock}`);

    res.json({ 
      success: true, 
      message: `Đã trả ${qty} sản phẩm vào kho`,
      data: {
        variantId: variant._id,
        previousStock: variant.stock - qty,
        currentStock: variant.stock,
        releasedQty: qty
      }
    });
  } catch (error) {
    console.error('Error releasing stock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/variants/:variantId/reserve-stock - Trừ kho (khi đặt hàng)
exports.reserveStock = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { qty } = req.body;

    if (!qty || qty <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số lượng không hợp lệ' 
      });
    }

    const variant = await ProductVariant.findById(variantId);
    
    if (!variant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy variant' 
      });
    }

    // Kiểm tra kho
    if (variant.stock < qty) {
      return res.status(400).json({ 
        success: false, 
        message: `Không đủ hàng trong kho. Còn lại: ${variant.stock}`,
        data: {
          availableStock: variant.stock,
          requestedQty: qty
        }
      });
    }

    // Trừ kho
    variant.stock -= qty;
    await variant.save();

    console.log(`✅ Đã trừ ${qty} sản phẩm từ kho. Stock hiện tại: ${variant.stock}`);

    res.json({ 
      success: true, 
      message: `Đã giữ ${qty} sản phẩm từ kho`,
      data: {
        variantId: variant._id,
        previousStock: variant.stock + qty,
        currentStock: variant.stock,
        reservedQty: qty
      }
    });
  } catch (error) {
    console.error('Error reserving stock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
