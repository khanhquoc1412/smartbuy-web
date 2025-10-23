const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brandsController');

// GET /api/brands - Lấy danh sách thương hiệu
router.get('/', brandsController.list);

// GET /api/brands/:id - Lấy thương hiệu theo ID
router.get('/:id', brandsController.getById);

// POST /api/brands - Tạo thương hiệu mới
router.post('/', brandsController.create);

// PUT /api/brands/:id - Cập nhật thương hiệu
router.put('/:id', brandsController.update);

// DELETE /api/brands/:id - Xóa thương hiệu
router.delete('/:id', brandsController.delete);

module.exports = router;
