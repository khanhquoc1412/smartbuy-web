const Order = require("../models/Order");
const axios = require("axios");
const config = require("../config/config");

class OrderService {
  /**
   * 1. TẠO ĐƠN HÀNG TỪ GIỎ HÀNG (User checkout)
   */
  async createOrderFromCart(orderData) {
    try {
      console.log('🔍 [Service] orderData received:', JSON.stringify(orderData, null, 2));

      const {
        userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
        notes,
        couponCode,
        token, // Extract token
      } = orderData;

      console.log('🔍 [Service] userId extracted:', userId);
      console.log('🔍 [Service] orderItems extracted:', orderItems);

      // Validate
      if (!userId || !orderItems || orderItems.length === 0) {
        throw new Error("Thiếu thông tin đơn hàng");
      }

      // Tạo Order với trạng thái pending_payment (nếu online) hoặc pending (nếu COD)
      // NOTE: Order model uses 'user' field, not 'userId'
      const order = new Order({
        user: userId, // Map userId → user for schema
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
        notes,
        couponCode,
        status: paymentMethod === "COD" ? "pending" : "pending_payment",
        paymentStatus: paymentMethod === "COD" ? "unpaid" : "pending",
      });

      // Thêm status history
      order.addStatusHistory(
        order.status,
        userId,
        "user",
        paymentMethod === "COD"
          ? "Đơn hàng COD đã tạo, chờ admin xác nhận"
          : "Đơn hàng đã tạo, chờ thanh toán"
      );

      await order.save();

      console.log(
        `✅ Order created: ${order.orderNumber} - Method: ${paymentMethod}`
      );

      // Nếu COD → Hoàn tất
      if (paymentMethod === "COD") {
        return {
          order,
          needPayment: false,
        };
      }

      // Nếu Online → Tạo Payment
      const paymentUrl = await this.createPaymentRequest(order, token);

      return {
        order,
        needPayment: true,
        paymentUrl,
      };
    } catch (error) {
      console.error("❌ Error creating order:", error);
      throw error;
    }
  }

  /**
   * 2. GỌI PAYMENT SERVICE ĐỂ TẠO PAYMENT
   */
  async createPaymentRequest(order, token) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const paymentUrl = `${config.PAYMENT_SERVICE_URL}/api/payments/create`;
      console.log('🔍 [OrderService] Calling Payment Service at:', paymentUrl);

      const response = await axios.post(
        paymentUrl,
        {
          orderId: order._id.toString(),
          userId: order.user.toString(), // Use order.user
          amount: order.totalPrice,
          paymentMethod: order.paymentMethod,
          customerInfo: {
            fullName: order.shippingAddress.fullName,
            phone: order.shippingAddress.phone,
          },
          description: `Thanh toán đơn hàng ${order.orderNumber}`,
        },
        {
          headers,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        // Lưu paymentId
        order.paymentId = response.data.data._id;
        await order.save();

        return response.data.data.paymentUrl;
      } else {
        throw new Error("Payment service failed");
      }
    } catch (error) {
      console.error("❌ Error creating payment:", error.message);
      if (error.response) {
        console.error("❌ Payment Service Response Data:", JSON.stringify(error.response.data, null, 2));
        console.error("❌ Payment Service Response Status:", error.response.status);
      }
      throw new Error("Không thể tạo thanh toán. Vui lòng thử lại.");
    }
  }

  /**
   * 3. XỬ LÝ WEBHOOK TỪ PAYMENT SERVICE
   */
  async handlePaymentCallback(callbackData) {
    try {
      const {
        orderId,
        paymentId,
        status,
        transactionId,
        amount,
        paymentMethod,
        paidAt,
      } = callbackData;

      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      if (status === "paid") {
        // Thanh toán thành công
        order.paymentStatus = "paid";
        order.paymentResult = {
          transactionId,
          paymentGateway: paymentMethod,
          paidAt: paidAt || new Date(),
          amount,
        };

        // Chuyển từ pending_payment → pending (chờ admin xác nhận)
        order.addStatusHistory(
          "pending",
          "system",
          "system",
          "Thanh toán thành công, đơn hàng chờ xác nhận"
        );

        // Disable auto cancel
        if (order.autoCancel) {
          order.autoCancel.enabled = false;
        }

        await order.save();

        console.log(`✅ Payment success for order ${order.orderNumber}`);

        // TODO: Gửi email xác nhận
        // await emailService.sendPaymentSuccess(order);

        return order;
      } else if (status === "failed") {
        // Thanh toán thất bại
        order.paymentStatus = "failed";
        order.addStatusHistory(
          "payment_failed",
          "system",
          "system",
          "Thanh toán thất bại"
        );

        await order.save();

        console.log(`⚠️ Payment failed for order ${order.orderNumber}`);

        return order;
      }
    } catch (error) {
      console.error("❌ Error handling payment callback:", error);
      throw error;
    }
  }

  /**
   * 4. LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
   */
  async getUserOrders(userId, filters = {}, page = 1, limit = 10) {
    try {
      // Fix: Schema uses 'user' field, not 'userId'
      const query = { user: userId };

      // Filter theo status
      if (filters.status) {
        query.status = filters.status;
      }

      // Filter theo paymentStatus
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }

      // Filter theo ngày
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(query),
      ]);

      return {
        orders: Order.addOrderNumbers(orders),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("❌ Error getting user orders:", error);
      throw error;
    }
  }

  /**
   * 5. LẤY CHI TIẾT ĐƠN HÀNG
   */
  async getOrderById(orderId, userId) {
    try {
      const order = await Order.findOne({
        _id: orderId,
        user: userId, // Fix: use 'user' field
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      return order;
    } catch (error) {
      console.error("❌ Error getting order:", error);
      throw error;
    }
  }

  /**
   * 6. HỦY ĐƠN HÀNG (User)
   */
  async cancelOrderByUser(orderId, userId, reason) {
    try {
      const order = await this.getOrderById(orderId, userId);

      if (!order.canCancelByUser()) {
        throw new Error(
          `Không thể hủy đơn hàng ở trạng thái "${order.status}"`
        );
      }

      order.cancelReason = reason;
      order.addStatusHistory(
        "cancelled",
        userId,
        "user",
        `Khách hàng hủy đơn: ${reason}`
      );

      // Nếu đã thanh toán → yêu cầu hoàn tiền
      if (order.paymentStatus === "paid") {
        await this.requestRefund(order);
      }

      await order.save();

      console.log(`✅ Order cancelled by user: ${orderId}`);

      return order;
    } catch (error) {
      console.error("❌ Error cancelling order:", error);
      throw error;
    }
  }

  /**
   * 7. XÁC NHẬN ĐÃ NHẬN HÀNG (User)
   */
  async confirmReceivedByUser(orderId, userId, note) {
    try {
      const order = await this.getOrderById(orderId, userId);

      if (!order.canConfirmReceived()) {
        throw new Error("Đơn hàng chưa được giao");
      }

      order.addStatusHistory(
        "completed",
        userId,
        "user",
        note || "Khách hàng xác nhận đã nhận hàng"
      );

      await order.save();

      console.log(`✅ Order completed by user: ${orderId}`);

      // TODO: Mở khóa đánh giá sản phẩm

      return order;
    } catch (error) {
      console.error("❌ Error confirming order:", error);
      throw error;
    }
  }

  /**
   * 8. YÊU CẦU HOÀN TIỀN
   */
  async requestRefund(order) {
    try {
      if (!order.paymentId) {
        console.warn("⚠️ Order không có paymentId");
        return;
      }

      console.log(`💰 Requesting refund for order ${order._id}`);

      // TODO: Call Payment Service để refund
      await axios.post(
        `${config.PAYMENT_SERVICE_URL}/api/payments/${order.paymentId}/refund`,
        {
          amount: order.totalPrice,
          reason: order.cancelReason || "Hủy đơn hàng",
        },
        {
          timeout: 10000,
        }
      );

      order.paymentStatus = "refunded";
      await order.save();
    } catch (error) {
      console.error("❌ Error requesting refund:", error.message);
    }
  }

  /**
   * 9. CẬP NHẬT PAYMENT STATUS (Webhook từ Payment Service)
   */
  async updatePaymentStatus(orderId, paymentStatus, transactionData = {}) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      order.paymentStatus = paymentStatus;

      if (paymentStatus === "paid") {
        // Thanh toán thành công
        order.paymentResult = {
          transactionId: transactionData.transactionId,
          paymentGateway: transactionData.paymentGateway || order.paymentMethod,
          paidAt: transactionData.paidAt || new Date(),
          amount: transactionData.amount || order.totalPrice,
        };

        // Chuyển từ pending_payment → pending
        order.status = "pending";
        order.addStatusHistory(
          "pending",
          null, // system actor should be null, not string
          "system",
          "Thanh toán thành công, đơn hàng chờ xác nhận"
        );

        // Disable auto cancel
        if (order.autoCancel) {
          order.autoCancel.enabled = false;
        }

        console.log(`✅ Payment success for order ${order.orderNumber}`);
      } else if (paymentStatus === "failed") {
        // Thanh toán thất bại
        order.status = "payment_failed";
        order.addStatusHistory(
          "payment_failed",
          null,
          "system",
          "Thanh toán thất bại"
        );

        console.log(`⚠️ Payment failed for order ${order.orderNumber}`);
      }

      await order.save();
      return order;
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      throw error;
    }
  }
}

module.exports = new OrderService();
