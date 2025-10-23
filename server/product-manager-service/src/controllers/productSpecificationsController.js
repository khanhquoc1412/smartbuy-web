const ProductSpecification = require('../models/product_specification');

// GET /api/products/:productId/specifications - Lấy tất cả thông số kỹ thuật của sản phẩm
exports.listByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const specs = await ProductSpecification.find({ productId })
      .populate('specsId', 'specName')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      items: specs,
      total: specs.length
    });
  } catch (error) {
    console.error('Error fetching product specifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:productId/specifications/:id - Lấy thông số theo ID
exports.getById = async (req, res) => {
  try {
    const spec = await ProductSpecification.findById(req.params.id)
      .populate('specsId', 'specName');
    
    if (!spec) {
      return res.status(404).json({ success: false, message: 'Specification not found' });
    }
    res.json({ success: true, data: spec });
  } catch (error) {
    console.error('Error fetching specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/:productId/specifications - Thêm thông số mới
exports.create = async (req, res) => {
  try {
    const { productId } = req.params;
    const { specsId, specValue } = req.body;
    
    if (!specsId) {
      return res.status(400).json({ success: false, message: 'specsId is required' });
    }
    
    const spec = new ProductSpecification({
      productId,
      specsId,
      specValue: specValue || ''
    });
    
    await spec.save();
    await spec.populate('specsId', 'specName');
    
    res.status(201).json({ success: true, data: spec });
  } catch (error) {
    console.error('Error creating specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:productId/specifications/:id - Cập nhật thông số
exports.update = async (req, res) => {
  try {
    const { specsId, specValue } = req.body;
    
    const spec = await ProductSpecification.findByIdAndUpdate(
      req.params.id,
      { specsId, specValue },
      { new: true, runValidators: true }
    ).populate('specsId', 'specName');
    
    if (!spec) {
      return res.status(404).json({ success: false, message: 'Specification not found' });
    }
    
    res.json({ success: true, data: spec });
  } catch (error) {
    console.error('Error updating specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:productId/specifications/:id - Xóa thông số
exports.delete = async (req, res) => {
  try {
    const spec = await ProductSpecification.findByIdAndDelete(req.params.id);
    
    if (!spec) {
      return res.status(404).json({ success: false, message: 'Specification not found' });
    }
    
    res.json({ success: true, message: 'Specification deleted successfully' });
  } catch (error) {
    console.error('Error deleting specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
