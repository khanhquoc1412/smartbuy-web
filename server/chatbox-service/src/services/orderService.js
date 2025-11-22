const axios = require('axios');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';

/**
 * Get order by order number
 * @param {String} orderNumber - Order number (e.g., ORD-20251118-XXXXXX)
 * @returns {Promise<Object|null>} Order details
 */
exports.getOrderByNumber = async (orderNumber) => {
  try {
    console.log(`🔍 Searching order: ${orderNumber}`);
    
    // Call order-manager-service API with search parameter
    // The API will handle orderNumber matching logic
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders`, {
      params: {
        search: orderNumber,
        limit: 10
      },
      timeout: 5000
    });

    console.log(`📦 Response:`, response.data);

    const orders = response.data?.data?.orders || response.data?.items || [];
    
    if (orders.length === 0) {
      console.log(`❌ No orders found`);
      return null;
    }

    // Find exact match by orderNumber (case-insensitive)
    const order = orders.find(o => {
      const oNum = o.orderNumber || `ORD-${new Date(o.createdAt).toISOString().slice(0, 10).replace(/-/g, '')}-${o._id.toString().slice(-6).toUpperCase()}`;
      return oNum.toUpperCase() === orderNumber.toUpperCase();
    });

    if (order) {
      console.log(`✅ Found order: ${order.orderNumber || order._id}`);
      return order;
    }

    // If no exact match, return first result
    console.log(`⚠️ No exact match, returning first result`);
    return orders[0];
    
  } catch (error) {
    console.error('❌ Error getting order by number:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
};

/**
 * Get order by ID
 * @param {String} orderId - Order ID
 * @returns {Promise<Object|null>} Order details
 */
exports.getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${orderId}`, {
      timeout: 5000
    });

    return response.data?.data || null;
  } catch (error) {
    console.error('Error getting order by ID:', error.message);
    return null;
  }
};

/**
 * Cancel order
 * @param {String} orderNumber - Order number
 * @returns {Promise<Object>} Result object
 */
exports.cancelOrder = async (orderNumber) => {
  try {
    // First, get the order to find its ID
    const order = await this.getOrderByNumber(orderNumber);

    if (!order) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng'
      };
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    if (!cancellableStatuses.includes(order.status)) {
      return {
        success: false,
        message: 'Đơn hàng không thể hủy ở trạng thái hiện tại'
      };
    }

    // Call order service to cancel
    const response = await axios.put(
      `${ORDER_SERVICE_URL}/api/orders/${order._id}/status`,
      {
        status: 'cancelled',
        reason: 'Hủy bởi khách hàng qua chatbot'
      },
      {
        timeout: 5000
      }
    );

    return {
      success: true,
      message: 'Đơn hàng đã được hủy thành công',
      data: response.data?.data
    };
  } catch (error) {
    console.error('Error cancelling order:', error.message);
    return {
      success: false,
      message: 'Có lỗi xảy ra khi hủy đơn hàng'
    };
  }
};

/**
 * Get user orders
 * @param {String} userId - User ID
 * @param {Number} limit - Number of orders to return
 * @returns {Promise<Array>} List of orders
 */
exports.getUserOrders = async (userId, limit = 10) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders`, {
      params: {
        user: userId,
        limit
      },
      timeout: 5000
    });

    return response.data?.data?.orders || [];
  } catch (error) {
    console.error('Error getting user orders:', error.message);
    return [];
  }
};
