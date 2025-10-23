const express = require('express');
const router = express.Router();
const memoriesController = require('../controllers/memoriesController');

// GET /api/memories - Lấy danh sách bộ nhớ
router.get('/', memoriesController.list);

// GET /api/memories/:id - Lấy bộ nhớ theo ID
router.get('/:id', memoriesController.getById);

// POST /api/memories - Tạo bộ nhớ mới
router.post('/', memoriesController.create);

// PUT /api/memories/:id - Cập nhật bộ nhớ
router.put('/:id', memoriesController.update);

// DELETE /api/memories/:id - Xóa bộ nhớ
router.delete('/:id', memoriesController.delete);

module.exports = router;
