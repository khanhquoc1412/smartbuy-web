const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ctrl = require('../controllers/productsController');
const variantsCtrl = require('../controllers/productVariantsController');
const imagesCtrl = require('../controllers/productImagesController');
const specsCtrl = require('../controllers/productSpecificationsController');

// Multer configuration for file upload
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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
router.post('/:productId/images/upload', upload.single('image'), imagesCtrl.upload); // Upload route
router.get('/:productId/images', imagesCtrl.listByProduct);
router.post('/:productId/images', imagesCtrl.create);
router.get('/:productId/images/:id', imagesCtrl.getById);
router.put('/:productId/images/:id', imagesCtrl.update);
router.delete('/:productId/images/:id', imagesCtrl.delete);

// Product Specifications
router.get('/:productId/specifications', specsCtrl.listByProduct);
router.get('/:productId/specifications/:id', specsCtrl.getById);
router.post('/:productId/specifications', specsCtrl.create);
router.put('/:productId/specifications/:id', specsCtrl.update);
router.delete('/:productId/specifications/:id', specsCtrl.delete);

module.exports = router;


