const { Router } = require('express')
const productController = require('../controllers/product.controller')
const upload = require('../middlewares/multer')

const router = Router()

router.get('/get-all/:categoryName', productController.getAll)
router.get('/get-all', productController.getAll)
router.get('/search/:keyword', productController.getAll)
router.get('/sale', productController.getProductSale)
router.post('/create', productController.createProduct)
router.get('/:slug', productController.getProductBySlug)
router.post('/add/image', upload.any(), productController.addImageProduct)
router.get('/variant/:id', productController.getProductVariant)


module.exports = router