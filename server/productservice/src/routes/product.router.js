const { Router } = require('express')
const controller = require('../controllers/product.controller')
const upload = require('../middleware/multer')

const router = Router()

router.get('/get-all/:categoryName', controller.getAll)
router.get('/get-all', controller.getAll)
router.get('/search/:keyword', controller.getAll)
router.get('/sale', controller.getProductSale)
router.post('/create', controller.createProduct)
router.get('/:slug', controller.getProductBySlug)
router.post('/add/image', upload.any(), controller.addImageProduct)
router.get('/variant/:id', controller.getProductVariant)

module.exports = router

