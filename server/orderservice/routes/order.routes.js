const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');

// ============ USER ROUTES ============

/**
 * @route   POST /api/orders/create
 * @desc    Tạo đơn hàng từ giỏ hàng (User đã đăng nhập)
 * @access  Private
 */
router.post('/create', auth, orderController.createOrder);

/**
 * @route   POST /api/orders/create-order-guest
 * @desc    Tạo đơn hàng cho khách (Guest checkout)
 * @access  Public
 */
router.post('/create-order-guest', orderController.createOrderGuest);

/**
 * @route   GET /api/orders/list
 * @desc    Lấy danh sách đơn hàng của user
 * @access  Private
 * @query   ?page=1&limit=10&status=pending&paymentStatus=paid
 */
router.get('/list', auth, orderController.getUserOrders);

/**
 * @route   GET /api/orders/stats
 * @desc    Thống kê đơn hàng của user
 * @access  Private
 */
router.get('/stats', auth, orderController.getOrderStats);

/**
 * @route   GET /api/orders/:id
 * @desc    Lấy chi tiết đơn hàng
 * @access  Private
 */
router.get('/:id', auth, orderController.getOrderById);

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Hủy đơn hàng (chỉ khi pending/pending_payment/confirmed)
 * @access  Private
 */
router.patch('/:id/cancel', auth, orderController.cancelOrder);

/**
 * @route   PATCH /api/orders/:id/confirm-received
 * @desc    Xác nhận đã nhận hàng (khi status = delivered)
 * @access  Private
 */
router.patch('/:id/confirm-received', auth, orderController.confirmReceived);

// ============ WEBHOOK ROUTES ============

/**
 * @route   POST /api/orders/payment-callback
 * @desc    Webhook nhận callback từ PaymentService
 * @access  Internal (từ PaymentService)
 */
router.post('/payment-callback', orderController.handlePaymentCallback);

module.exports = router;