const ProductImage = require('../models/product_image');

// GET /api/products/:productId/images - Lấy tất cả hình ảnh của sản phẩm
exports.listByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const images = await ProductImage.find({ productId })
      .populate('colorId', 'name code')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      items: images,
      total: images.length
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:productId/images/:id - Lấy hình ảnh theo ID
exports.getById = async (req, res) => {
  try {
    const image = await ProductImage.findById(req.params.id)
      .populate('colorId', 'name code');
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: image });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/:productId/images - Thêm hình ảnh mới
exports.create = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, imageUrl, originalName, fileSize, colorId } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'imageUrl is required' });
    }
    
    const image = new ProductImage({
      productId,
      name,
      imageUrl,
      originalName,
      fileSize,
      colorId
    });
    
    await image.save();
    await image.populate('colorId', 'name code');
    
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:productId/images/:id - Cập nhật hình ảnh
exports.update = async (req, res) => {
  try {
    const { name, imageUrl, originalName, fileSize, colorId } = req.body;
    
    const image = await ProductImage.findByIdAndUpdate(
      req.params.id,
      { name, imageUrl, originalName, fileSize, colorId },
      { new: true, runValidators: true }
    ).populate('colorId', 'name code');
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    res.json({ success: true, data: image });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:productId/images/:id - Xóa hình ảnh
exports.delete = async (req, res) => {
  try {
    const image = await ProductImage.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
