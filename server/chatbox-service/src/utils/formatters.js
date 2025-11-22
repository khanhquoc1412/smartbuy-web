/**
 * Format price to Vietnamese currency
 * @param {Number} price - Price in VND
 * @returns {String} Formatted price
 */
exports.formatPrice = (price) => {
  if (!price || isNaN(price)) return '0đ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Format date to Vietnamese format
 * @param {Date|String} date - Date object or string
 * @returns {String} Formatted date
 */
exports.formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format order status to Vietnamese
 * @param {String} status - Order status
 * @returns {String} Vietnamese status
 */
exports.formatOrderStatus = (status) => {
  const statusMap = {
    'pending': '⏳ Chờ xác nhận',
    'pending_payment': '💳 Chờ thanh toán',
    'payment_failed': '❌ Thanh toán thất bại',
    'confirmed': '✅ Đã xác nhận',
    'processing': '📦 Đang chuẩn bị',
    'ready_to_ship': '🚚 Sẵn sàng giao',
    'shipping': '🚗 Đang giao',
    'delivered': '📬 Đã giao',
    'completed': '✅ Hoàn thành',
    'cancelled': '❌ Đã hủy',
    'returned': '🔄 Đã trả hàng'
  };

  return statusMap[status] || status;
};

/**
 * Format payment method to Vietnamese
 * @param {String} method - Payment method
 * @returns {String} Vietnamese payment method
 */
exports.formatPaymentMethod = (method) => {
  const methodMap = {
    'COD': '💵 Thanh toán khi nhận hàng',
    'VNPAY': '💳 VNPAY',
    'MOMO': '📱 MoMo',
    'ZALOPAY': '💙 ZaloPay',
    'CREDIT_CARD': '💳 Thẻ tín dụng'
  };

  return methodMap[method] || method;
};

/**
 * Truncate text to specified length
 * @param {String} text - Text to truncate
 * @param {Number} maxLength - Maximum length
 * @returns {String} Truncated text
 */
exports.truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Parse price range string to min/max values
 * @param {String} priceRange - Price range (e.g., "5-10 triệu")
 * @returns {Object} { minPrice, maxPrice }
 */
exports.parsePriceRange = (priceRange) => {
  if (!priceRange) return { minPrice: 0, maxPrice: 999999999 };

  const multiplier = 1000000; // 1 million VND

  if (priceRange.includes('dưới')) {
    const match = priceRange.match(/\d+/);
    return {
      minPrice: 0,
      maxPrice: match ? parseInt(match[0]) * multiplier : 999999999
    };
  }

  if (priceRange.includes('trên')) {
    const match = priceRange.match(/\d+/);
    return {
      minPrice: match ? parseInt(match[0]) * multiplier : 0,
      maxPrice: 999999999
    };
  }

  // Range: "5-10 triệu"
  const matches = priceRange.match(/(\d+)-(\d+)/);
  if (matches) {
    return {
      minPrice: parseInt(matches[1]) * multiplier,
      maxPrice: parseInt(matches[2]) * multiplier
    };
  }

  return { minPrice: 0, maxPrice: 999999999 };
};
