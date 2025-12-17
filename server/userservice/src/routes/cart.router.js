const { Router } = require('express')
const cartController = require('../controllers/cart.controller')
const { auth } = require('../middlewares/auth')

const router = Router()

router.post('/add',
    auth,
    cartController.addProductToCart
)
router.patch('/decr-qty/:cartId',
    auth,
    cartController.decreaseQuantity
)
router.delete('/:cartId',
    auth,
    cartController.removeProduct
)
router.get('/user/:userId',
    auth,
    cartController.getUserCarts
)


module.exports = router