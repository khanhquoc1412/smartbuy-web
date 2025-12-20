const Order = require("../models/Order");
const axios = require("axios");
const config = require("../config/config");
const mongoose = require("mongoose");

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
        cartItemIds, // ✅ NEW: List of cart item IDs to remove after order creation
      } = orderData;

      console.log('🔍 [Service] userId extracted:', userId);
      console.log('🔍 [Service] orderItems extracted:', orderItems);
      console.log('🔍 [Service] cartItemIds to remove:', cartItemIds);

      // Validate
      if (!userId || !orderItems || orderItems.length === 0) {
        throw new Error("Thiếu thông tin đơn hàng");
      }

      // ✅ NEW: Deduct stock from Product Service
      // Extract items for stock update
      const stockUpdateItems = orderItems.map(item => ({
        variantId: item.variant?.variantId, // ✅ Fix: Access nested variantId
        quantity: item.qty || item.quantity, // ✅ Fix: Client sends 'qty', schema uses 'qty'
        action: 'deduct'
      }));

      console.log('🔄 [OrderService] Deducting stock for items:', JSON.stringify(stockUpdateItems, null, 2));

      try {
        await this.updateStock(stockUpdateItems, token);
        console.log('✅ Stock deducted successfully');
      } catch (error) {
        console.error('❌ Failed to deduct stock:', error.message);
        throw new Error(`Không thể tạo đơn hàng: ${error.message}`);
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

      // ✅ NEW: Remove purchased items from cart
      console.log('🔍 [OrderService] Checking cartItemIds:', cartItemIds);
      console.log('🔍 [OrderService] cartItemIds type:', typeof cartItemIds);
      console.log('🔍 [OrderService] cartItemIds isArray:', Array.isArray(cartItemIds));
      console.log('🔍 [OrderService] cartItemIds length:', cartItemIds?.length);

      if (cartItemIds && Array.isArray(cartItemIds) && cartItemIds.length > 0) {
        console.log(`🔄 [OrderService] Attempting to remove ${cartItemIds.length} items from cart...`);
        try {
          await this.removeCartItems(userId, cartItemIds, token);
          console.log(`✅ Removed ${cartItemIds.length} items from cart after order creation`);
        } catch (error) {
          // Log error but don't fail the order
          console.error("⚠️ Failed to remove cart items:", error.message);
          console.error("⚠️ Error stack:", error.stack);
        }
      } else {
        console.log('⚠️ [OrderService] No cartItemIds provided or invalid, skipping cart cleanup');
      }

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
      // Hỗ trợ cả string và array
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query.status = { $in: filters.status };
        } else {
          query.status = filters.status;
        }
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

      // ✅ Calculate total amount of ALL orders EXCEPT cancelled/returned
      // Use ObjectId conversion for aggregation
      const totalAmountQuery = {
        user: new mongoose.Types.ObjectId(userId), // ✅ MUST convert to ObjectId for aggregate
        status: { $nin: ['cancelled', 'returned'] }
      };

      // If there's a specific status filter, apply it to totalAmount too
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          const filteredStatuses = filters.status.filter(s => !['cancelled', 'returned'].includes(s));
          if (filteredStatuses.length > 0) {
            totalAmountQuery.status = { $in: filteredStatuses };
          } else {
            totalAmountQuery.status = { $in: [] };
          }
        } else if (!['cancelled', 'returned'].includes(filters.status)) {
          totalAmountQuery.status = filters.status;
        } else {
          totalAmountQuery.status = { $in: [] };
        }
      }

      const totalAmountResult = await Order.aggregate([
        { $match: totalAmountQuery },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalPrice" }
          }
        }
      ]);

      const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;

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
          totalAmount, // ✅ Sum of ALL orders matching filter
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
  async cancelOrderByUser(orderId, userId, reason, token) {
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
        reason ? `Khách hàng hủy đơn: ${reason}` : "Khách hàng hủy đơn"
      );

      // Nếu đã thanh toán → yêu cầu hoàn tiền
      let refundInfo = null;
      if (order.paymentStatus === "paid") {
        await this.requestRefund(order);
        refundInfo = {
          amount: order.totalPrice,
          method: order.paymentMethod,
          transactionId: order.paymentResult?.transactionId,
          refundedAt: new Date(),
        };
      }

      // ✅ NEW: Restore stock
      const stockRestoreItems = order.orderItems.map(item => ({
        variantId: item.variant?.variantId, // ✅ Fix: Access nested variantId
        quantity: item.qty, // ✅ Fix: Schema uses 'qty'
        action: 'restore'
      }));

      console.log('🔄 [OrderService] Restoring stock for cancelled order:', JSON.stringify(stockRestoreItems, null, 2));

      try {
        await this.updateStock(stockRestoreItems, token);
        console.log('✅ Stock restored successfully');
      } catch (error) {
        console.error('⚠️ Failed to restore stock (non-blocking):', error.message);
        // Don't fail cancellation if stock restore fails, but log it
      }

      await order.save();

      console.log(`✅ Order cancelled by user: ${orderId}`);

      // ✅ NEW: Send email notification
      try {
        const userServiceUrl = config.USER_SERVICE_URL;
        console.log(`🔍 [Email Debug] Fetching user info from: ${userServiceUrl}/api/auth/profile`);
        console.log(`🔍 [Email Debug] Token available: ${!!token}`);

        // Note: userservice usually requires token to get profile, or internal API.
        // If we have token, use it. If not (e.g. system action), we might need internal API.
        // Here we use the token passed from controller.

        let customerEmail, customerName;

        if (token) {
          try {
            const userResponse = await axios.get(`${userServiceUrl}/api/auth/profile`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`🔍 [Email Debug] User profile response status: ${userResponse.status}`);

            if (userResponse.data) {
              const user = userResponse.data;
              customerEmail = user.email;
              // Schema only has userName, no firstName/lastName
              customerName = user.userName || user.username || 'Quý khách';
              console.log(`🔍 [Email Debug] Found user email: ${customerEmail}, Name: ${customerName}`);
            }
          } catch (profileError) {
            console.error(`❌ [Email Debug] Failed to fetch user profile: ${profileError.message}`);
            if (profileError.response) {
              console.error(`❌ [Email Debug] Profile Response:`, JSON.stringify(profileError.response.data));
            }
          }
        } else {
          // Fallback: use shipping address info if no token (shouldn't happen for user cancel)
          console.log(`⚠️ [Email Debug] No token provided, falling back to shipping address info`);
          customerEmail = ""; // We don't have email in order schema unless we save it
          customerName = order.shippingAddress.fullName;
        }

        if (customerEmail) {
          const emailService = require('./email.service');
          const refundAmount = refundInfo ? refundInfo.amount : 0;
          console.log(`🔍 [Email Debug] Attempting to send email to ${customerEmail}`);

          emailService.sendOrderStatusEmail(order, "cancelled", customerEmail, customerName, refundAmount)
            .then(result => console.log(`✅ [Email Debug] Email send result: ${result}`))
            .catch(err => console.error("❌ [Email Debug] Background email error:", err.message));
        } else {
          console.warn("⚠️ [Email Debug] Could not determine customer email for notification. Token was: " + (token ? "Provided" : "Missing"));
        }

      } catch (emailError) {
        console.error("❌ [Email Debug] Error in email sending block:", emailError.message);
      }

      return { order, refundInfo };
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
        // Thanh toán thất bại → Tự động HỦY đơn hàng
        order.paymentStatus = "failed";
        order.status = "cancelled";
        order.cancelReason = "Khách hàng thanh toán thất bại, yêu cầu đặt lại đơn hàng khác";

        order.addStatusHistory(
          "cancelled",
          null,
          "system",
          "Đơn hàng tự động hủy do thanh toán thất bại"
        );

        console.log(`⚠️ Payment failed for order ${order.orderNumber} - Order auto-cancelled`);

        // ✅ Send email notification to customer
        try {
          const emailService = require('./email.service');
          await emailService.sendOrderStatusEmail(
            order,
            'cancelled',
            order.shippingAddress.email || order.shippingAddress.phone + '@temp.com', // Fallback if no email
            order.shippingAddress.fullName
          );
          console.log(`📧 Cancellation email sent for order ${order.orderNumber}`);
        } catch (emailError) {
          console.error('❌ Failed to send cancellation email:', emailError.message);
          // Don't fail the whole operation if email fails
        }

        // ✅ Release stock back to inventory
        if (order.stockReserved) {
          try {
            // Call ProductService to release stock
            for (const item of order.orderItems) {
              if (item.variant?.variantId) {
                // Release stock for variant
                await axios.patch(
                  `${config.PRODUCT_SERVICE_URL}/api/products/variants/${item.variant.variantId}/stock/release`,
                  { quantity: item.qty }
                );
              } else if (item.product) {
                // Release stock for main product
                await axios.patch(
                  `${config.PRODUCT_SERVICE_URL}/api/products/${item.product}/stock/release`,
                  { quantity: item.qty }
                );
              }
            }
            order.stockReleased = true;
            console.log(`📦 Stock released for cancelled order ${order.orderNumber}`);
          } catch (stockError) {
            console.error('❌ Failed to release stock:', stockError.message);
            // Don't fail the whole operation if stock release fails
          }
        }
      }

      await order.save();
      return order;
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Remove cart items after order creation
   */
  async removeCartItems(userId, cartItemIds, token) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartUrl = `${config.CART_SERVICE_URL}/api/cart/items`;
      console.log('🔍 [OrderService] Calling CartService at:', cartUrl);
      console.log('🔍 [OrderService] Removing cart items:', cartItemIds);

      const response = await axios.delete(
        cartUrl,
        {
          data: { itemIds: cartItemIds },
          headers,
          timeout: 5000,
        }
      );

      if (response.data.success) {
        console.log(`✅ Successfully removed ${cartItemIds.length} items from cart`);
        return response.data;
      } else {
        throw new Error("Cart service failed to remove items");
      }
    } catch (error) {
      console.error("❌ Error removing cart items:", error.message);
      if (error.response) {
        console.error("❌ Cart Service Response Data:", JSON.stringify(error.response.data, null, 2));
        console.error("❌ Cart Service Response Status:", error.response.status);
      }
      // Don't throw - let order creation succeed even if cart cleanup fails
      throw error;
    }
  }

  /**
   * ✅ NEW: Call Product Service to update stock
   */
  async updateStock(items, token) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const productUrl = `${config.PRODUCT_SERVICE_URL}/api/product/stock`;
      console.log('🔍 [OrderService] Calling ProductService at:', productUrl);

      const response = await axios.patch(
        productUrl,
        { items },
        {
          headers,
          timeout: 5000,
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("❌ Error updating stock:", error.message);
      if (error.response) {
        console.error("❌ Product Service Response Data:", JSON.stringify(error.response.data, null, 2));
        // Throw the specific error message from product service if available
        throw new Error(error.response.data.message || error.message);
      }
      throw error;
    }
  }
}

module.exports = new OrderService();

