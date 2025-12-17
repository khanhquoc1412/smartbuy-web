const { Router } = require('express')
const orderController = require('../controllers/order.controller')
const { auth } = require('../middlewares/auth')

const router = Router()

router.post('/create',
    auth,
    orderController.createOrder
)
router.get('/list',
    auth,
    orderController.getUserOrders
)
router.post('/create-order-guest',
    orderController.createOrderGuest
)

module.exports = router