const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/productsController');
const variantsCtrl = require('../controllers/productVariantsController');
const imagesCtrl = require('../controllers/productImagesController');
const specsCtrl = require('../controllers/productSpecificationsController');

// Health
router.get('/health', ctrl.health);

// CRUD Products
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// Product Variants
router.get('/:productId/variants', variantsCtrl.listByProduct);
router.get('/:productId/variants/:id', variantsCtrl.getById);
router.post('/:productId/variants', variantsCtrl.create);
router.put('/:productId/variants/:id', variantsCtrl.update);
router.delete('/:productId/variants/:id', variantsCtrl.delete);

// Product Images
router.get('/:productId/images', imagesCtrl.listByProduct);
router.get('/:productId/images/:id', imagesCtrl.getById);
router.post('/:productId/images', imagesCtrl.create);
router.put('/:productId/images/:id', imagesCtrl.update);
router.delete('/:productId/images/:id', imagesCtrl.delete);

// Product Specifications
router.get('/:productId/specifications', specsCtrl.listByProduct);
router.get('/:productId/specifications/:id', specsCtrl.getById);
router.post('/:productId/specifications', specsCtrl.create);
router.put('/:productId/specifications/:id', specsCtrl.update);
router.delete('/:productId/specifications/:id', specsCtrl.delete);

module.exports = router;


