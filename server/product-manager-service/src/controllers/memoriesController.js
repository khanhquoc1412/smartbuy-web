const Memory = require('../models/memory');

// GET /api/memories - Lấy danh sách bộ nhớ
exports.list = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      items: memories,
      total: memories.length
    });
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/memories/:id - Lấy bộ nhớ theo ID
exports.getById = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }
    res.json({ success: true, data: memory });
  } catch (error) {
    console.error('Error fetching memory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/memories - Tạo bộ nhớ mới
exports.create = async (req, res) => {
  try {
    const { ram, rom, chipset } = req.body;
    const memory = new Memory({ ram, rom, chipset });
    await memory.save();
    res.status(201).json({ success: true, data: memory });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/memories/:id - Cập nhật bộ nhớ
exports.update = async (req, res) => {
  try {
    const { ram, rom, chipset } = req.body;
    const memory = await Memory.findByIdAndUpdate(
      req.params.id,
      { ram, rom, chipset },
      { new: true, runValidators: true }
    );
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }
    res.json({ success: true, data: memory });
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/memories/:id - Xóa bộ nhớ
exports.delete = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }
    res.json({ success: true, message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
