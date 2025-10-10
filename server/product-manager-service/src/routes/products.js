const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/productsController');

// Health
router.get('/health', ctrl.health);

// CRUD
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;


