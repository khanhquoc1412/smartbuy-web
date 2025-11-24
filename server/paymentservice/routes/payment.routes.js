const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const auth = require("../middleware/auth");

// ============ PAYMENT ROUTES ============

/**
 * @route   POST /api/payments/create
 * @desc    Tạo payment và lấy payment URL
 * @access  Private
 * @body    { orderId, userId, amount, paymentMethod, customerInfo, description, bankCode }
 */
router.post("/create", auth, paymentController.createPayment);

/**
 * @route   GET /api/payments/:id
 * @desc    Lấy thông tin payment theo ID
 * @access  Private
 */
router.get("/:id", auth, paymentController.getPaymentById);

/**
 * @route   GET /api/payments/order/:orderId
 * @desc    Lấy payment theo orderId
 * @access  Private
 */
router.get("/order/:orderId", auth, paymentController.getPaymentByOrderId);

/**
 * @route   GET /api/payments/vnpay/return
 * @desc    VNPAY return URL (user redirect về sau khi thanh toán)
 * @access  Public
 */
router.get("/vnpay/return", paymentController.handleVNPayReturn);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Hoàn tiền payment
 * @access  Private (Admin)
 */
router.post("/:id/refund", auth, paymentController.refundPayment);

/**
 * @route   POST /api/payments/:id/cancel
 * @desc    Hủy payment
 * @access  Private
 */
router.post("/:id/cancel", auth, paymentController.cancelPayment);

module.exports = router;
