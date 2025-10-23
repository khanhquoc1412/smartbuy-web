const express = require('express');
const router = express.Router();
const specificationsController = require('../controllers/specificationsController');

// GET /api/specifications - Lấy danh sách thông số kỹ thuật
router.get('/', specificationsController.list);

// GET /api/specifications/:id - Lấy thông số theo ID
router.get('/:id', specificationsController.getById);

// POST /api/specifications - Tạo thông số mới
router.post('/', specificationsController.create);

// PUT /api/specifications/:id - Cập nhật thông số
router.put('/:id', specificationsController.update);

// DELETE /api/specifications/:id - Xóa thông số
router.delete('/:id', specificationsController.delete);

module.exports = router;
