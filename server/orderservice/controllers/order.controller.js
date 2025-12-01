const orderService = require("../services/order.service");

/**
 * Tạo đơn hàng từ giỏ hàng (User đã đăng nhập)
 * POST /api/orders/create
 */
exports.createOrder = async (req, res, next) => {
  try {
    console.log('🔍 [Controller] req.body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 [Controller] req.user:', req.user);

    const userId = req.user.id;
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    const orderData = {
      ...req.body,
      userId,
      token, // Pass token
    };

    console.log('🔍 [Controller] orderData constructed:', JSON.stringify(orderData, null, 2));

    const result = await orderService.createOrderFromCart(orderData);

    // Convert order to JSON to include virtual fields like orderNumber
    const orderJSON = result.order.toJSON();

    res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: {
        ...result,
        order: orderJSON,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo đơn hàng cho khách (Guest checkout)
 * POST /api/orders/create-order-guest
 */
exports.createOrderGuest = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      userId: null, // Guest không có userId
    };

    const result = await orderService.createOrderFromCart(orderData);

    res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách đơn hàng của user
 * GET /api/orders/list
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Handle status: có thể là string hoặc array
    let status = req.query.status;

    // Nếu client gửi "status=a&status=b&status=c", express sẽ parse thành array
    // Nếu gửi "status=a", express sẽ parse thành string
    // Ta giữ nguyên để service xử lý

    const filters = {
      status: status,
      paymentStatus: req.query.paymentStatus,
    };

    const result = await orderService.getUserOrders(
      userId,
      filters,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thống kê đơn hàng của user
 * GET /api/orders/stats
 */
exports.getOrderStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // TODO: Implement statistics
    const stats = {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết đơn hàng
 * GET /api/orders/:id
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await orderService.getOrderById(id, userId);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Hủy đơn hàng
 * PATCH /api/orders/:id/cancel
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    const result = await orderService.cancelOrderByUser(id, userId, reason, token);

    // Check if result contains refundInfo (new structure) or just order (old structure)
    const order = result.order || result;
    const refundInfo = result.refundInfo;

    const message = refundInfo
      ? `Đơn hàng đã được hủy và hoàn tiền ${refundInfo.amount.toLocaleString("vi-VN")}₫`
      : "Hủy đơn hàng thành công";

    res.status(200).json({
      success: true,
      message: message,
      data: {
        order,
        refund: refundInfo
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xác nhận đã nhận hàng
 * PATCH /api/orders/:id/confirm-received
 */
exports.confirmReceived = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    const order = await orderService.confirmReceivedByUser(id, userId, note);

    res.status(200).json({
      success: true,
      message: "Xác nhận đã nhận hàng thành công",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook callback từ Payment Service
 * POST /api/orders/payment-callback
 */
exports.handlePaymentCallback = async (req, res, next) => {
  try {
    const { orderId, paymentStatus, transactionData } = req.body;

    if (!orderId || !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Cập nhật payment status của order
    const order = await orderService.updatePaymentStatus(
      orderId,
      paymentStatus,
      transactionData
    );

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      data: order,
    });
  } catch (error) {
    // Vẫn trả 200 để payment service không retry
    console.error("❌ Webhook error:", error);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
