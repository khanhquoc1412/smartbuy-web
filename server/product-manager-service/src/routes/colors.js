const express = require('express');
const router = express.Router();
const colorsController = require('../controllers/colorsController');

// GET /api/colors - Lấy danh sách màu sắc
router.get('/', colorsController.list);

// GET /api/colors/:id - Lấy màu sắc theo ID
router.get('/:id', colorsController.getById);

// POST /api/colors - Tạo màu sắc mới
router.post('/', colorsController.create);

// PUT /api/colors/:id - Cập nhật màu sắc
router.put('/:id', colorsController.update);

// DELETE /api/colors/:id - Xóa màu sắc
router.delete('/:id', colorsController.delete);

module.exports = router;
