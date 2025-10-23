const Specification = require('../models/specification');

// GET /api/specifications - Lấy danh sách thông số kỹ thuật
exports.list = async (req, res) => {
  try {
    const specifications = await Specification.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      items: specifications,
      total: specifications.length
    });
  } catch (error) {
    console.error('Error fetching specifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/specifications/:id - Lấy thông số theo ID
exports.getById = async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id);
    if (!specification) {
      return res.status(404).json({ success: false, message: 'Specification not found' });
    }
    res.json({ success: true, data: specification });
  } catch (error) {
    console.error('Error fetching specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/specifications - Tạo thông số mới
exports.create = async (req, res) => {
  try {
    const { specName } = req.body;
    if (!specName) {
      return res.status(400).json({ success: false, message: 'specName is required' });
    }
    const specification = new Specification({ specName });
    await specification.save();
    res.status(201).json({ success: true, data: specification });
  } catch (error) {
    console.error('Error creating specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/specifications/:id - Cập nhật thông số
exports.update = async (req, res) => {
  try {
    const { specName } = req.body;
    const specification = await Specification.findByIdAndUpdate(
      req.params.id,
      { specName },
      { new: true, runValidators: true }
    );
    if (!specification) {
      return res.status(404).json({ success: false, message: 'Specification not found' });
    }
    res.json({ success: true, data: specification });
  } catch (error) {
    console.error('Error updating specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/specifications/:id - Xóa thông số
exports.delete = async (req, res) => {
  try {
    const specification = await Specification.findByIdAndDelete(req.params.id);
    if (!specification) {
      return res.status(404).json({ success: false, message: 'Specification not found' });
    }
    res.json({ success: true, message: 'Specification deleted successfully' });
  } catch (error) {
    console.error('Error deleting specification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
