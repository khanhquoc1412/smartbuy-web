const Color = require('../models/color');

exports.list = async (req, res) => {
  try {
    const colors = await Color.find().sort({ createdAt: -1 });
    res.json({ success: true, items: colors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) return res.status(404).json({ success: false, message: 'Color not found' });
    res.json({ success: true, item: color });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.status(201).json({ success: true, item: color });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!color) return res.status(404).json({ success: false, message: 'Color not found' });
    res.json({ success: true, item: color });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) return res.status(404).json({ success: false, message: 'Color not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
