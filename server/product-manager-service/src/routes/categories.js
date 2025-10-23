const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// GET /api/categories - Lấy danh sách danh mục
router.get('/', categoriesController.list);

// GET /api/categories/:id - Lấy danh mục theo ID
router.get('/:id', categoriesController.getById);

// POST /api/categories - Tạo danh mục mới
router.post('/', categoriesController.create);

// PUT /api/categories/:id - Cập nhật danh mục
router.put('/:id', categoriesController.update);

// DELETE /api/categories/:id - Xóa danh mục
router.delete('/:id', categoriesController.delete);

module.exports = router;
