const productService = require('../services/productService');
const orderService = require('../services/orderService');
const formatters = require('../utils/formatters');

/**
 * ==================== PRODUCT INTENT HANDLERS ====================
 */

/**
 * INTENT: product.search
 * TRIGGER: "Tìm điện thoại", "Xem sản phẩm", "Có điện thoại nào không"
 * 
 * PARAMETERS:
 * - product-category (optional): Loại sản phẩm (ví dụ: "điện thoại")
 * - price-range (optional): Khoảng giá (ví dụ: "dưới-5-trieu", "5-10-trieu")
 * 
 * RESPONSE: 
 * - Rich content cards hiển thị danh sách sản phẩm
 * - Suggestion chips gợi ý thương hiệu và mức giá
 * 
 * API CALL: GET /api/products/search?category=...&priceRange=...&limit=5
 */
exports.handleProductSearch = async (parameters, queryResult) => {
  try {
    const category = parameters['product-category'];
    const priceRange = parameters['price-range'];

    console.log(`🔍 Searching products - Category: ${category}, Price: ${priceRange}`);

    // Call product service
    const products = await productService.searchProducts({
      category,
      priceRange,
      limit: 5
    });

    if (!products || products.length === 0) {
      return {
        fulfillmentText: `Xin lỗi, hiện tại chúng tôi không có điện thoại nào phù hợp với tiêu chí tìm kiếm. Bạn có thể thử tìm với thương hiệu hoặc mức giá khác không?`,
        fulfillmentMessages: [
          {
            text: {
              text: [`Không tìm thấy điện thoại phù hợp. Bạn muốn xem thương hiệu nào? (iPhone, Samsung, Oppo, Xiaomi...)`]
            }
          },
          {
            payload: {
              richContent: [
                [{ type: 'chips', options: [
                  { text: '🍎 iPhone' },
                  { text: '📱 Samsung' },
                  { text: '🔵 Oppo' },
                  { text: '📲 Xiaomi' }
                ]}]
              ]
            }
          }
        ]
      };
    }

    // Format products for rich response
    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)}${product.brand ? ` • ${product.brand.name}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const responseText = `🔍 Tìm thấy ${products.length} sản phẩm ${category || 'phù hợp'}\n\n✨ Xem chi tiết bằng cách nhấn vào sản phẩm bên dưới:`;

    // Suggestion chips
    const suggestionChips = [
      { type: 'chips', options: [
        { text: '🍎 iPhone' },
        { text: '📱 Samsung' },
        { text: '💰 Điện thoại dưới 5 triệu' },
        { text: '🎁 Khuyến mãi' }
      ]}
    ];

    return {
      fulfillmentText: responseText,
      fulfillmentMessages: [
        {
          text: {
            text: [responseText]
          }
        },
        {
          payload: {
            richContent: [
              productCards,
              [{ type: 'divider' }],
              suggestionChips
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleProductSearch:', error);
    return {
      fulfillmentText: 'Xin lỗi, có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại.'
    };
  }
};

/**
 * INTENT: product.search.by-brand
 * TRIGGER: "Tìm iPhone", "Xem điện thoại Samsung", "Có Oppo nào không"
 * 
 * PARAMETERS:
 * - brand-name (required): Tên thương hiệu (ví dụ: "Apple", "Samsung", "Oppo")
 * - product-category (optional): Loại sản phẩm
 * 
 * RESPONSE:
 * - Rich content cards hiển thị sản phẩm của thương hiệu
 * - Hiển thị brand name trong subtitle
 * - Chips gợi ý lọc theo giá hoặc xem thương hiệu khác
 * 
 * API CALL: GET /api/products/search?brand=...&category=...&limit=5
 */
exports.handleProductSearchByBrand = async (parameters, queryResult) => {
  try {
    const brand = parameters['brand-name'];
    const category = parameters['product-category'];

    console.log(`🔍 Searching products - Brand: ${brand}, Category: ${category}`);

    const products = await productService.searchProductsByBrand({
      brand,
      category,
      limit: 5
    });

    if (!products || products.length === 0) {
      return {
        fulfillmentText: `Xin lỗi, hiện tại chúng tôi không có sản phẩm ${brand} ${category || ''} nào. Bạn muốn xem thương hiệu khác không?`
      };
    }

    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)} • 🏷️ ${product.brand?.name || brand}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerText = `🔍 Tìm thấy ${products.length} sản phẩm ${brand}\n\n✨ Nhấn vào sản phẩm để xem chi tiết:`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              productCards,
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '🔍 Tìm thương hiệu khác' },
                { text: '💰 Lọc theo giá' },
                { text: '🏠 Trang chủ' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleProductSearchByBrand:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi tìm kiếm theo thương hiệu.'
    };
  }
};

/**
 * INTENT: product.search.by-price
 * TRIGGER: "Tìm điện thoại dưới 10 triệu", "Sản phẩm từ 5 đến 15 triệu"
 * 
 * PARAMETERS:
 * - min_price (optional): Giá tối thiểu (số nguyên, ví dụ: 5000000)
 * - max_price (optional): Giá tối đa (số nguyên, ví dụ: 10000000)
 * - product-category (optional): Loại sản phẩm
 * 
 * RESPONSE:
 * - Rich content cards với sản phẩm trong khoảng giá
 * - Hiển thị rõ khoảng giá đang lọc
 * - Chips gợi ý các khoảng giá khác
 * 
 * API CALL: GET /api/products/search?minPrice=...&maxPrice=...&limit=5
 */
exports.handleProductSearchByPrice = async (parameters, queryResult) => {
  try {
    const minPrice = parameters['min_price'];
    const maxPrice = parameters['max_price'];
    const category = parameters['product-category'];

    console.log(`🔍 Searching products - Price: ${minPrice}-${maxPrice}, Category: ${category}`);

    const products = await productService.searchProductsByPrice({
      minPrice,
      maxPrice,
      category,
      limit: 5
    });

    if (!products || products.length === 0) {
      return {
        fulfillmentText: `Không tìm thấy sản phẩm nào trong khoảng giá ${formatters.formatPrice(minPrice)} - ${formatters.formatPrice(maxPrice)}. Bạn muốn xem khoảng giá khác không?`
      };
    }

    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)}${product.brand ? ` • ${product.brand.name}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerText = `💰 Tìm thấy ${products.length} sản phẩm\n📊 Khoảng giá: ${formatters.formatPrice(minPrice)} - ${formatters.formatPrice(maxPrice)}\n\n✨ Các sản phẩm phù hợp với ngân sách của bạn:`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              productCards,
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '💵 Dưới 5 triệu' },
                { text: '💸 5-10 triệu' },
                { text: '💎 10-20 triệu' },
                { text: '👑 Trên 20 triệu' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleProductSearchByPrice:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi tìm kiếm theo giá.'
    };
  }
};

/**
 * INTENT: product.detail
 * TRIGGER: "Thông tin iPhone 15", "Chi tiết Samsung S24", "Xem cấu hình Oppo A78"
 * 
 * PARAMETERS:
 * - product-name (required): Tên sản phẩm (ví dụ: "iPhone 15", "Samsung Galaxy S24")
 * 
 * RESPONSE:
 * - Thông tin chi tiết: giá, tình trạng, đánh giá, giảm giá
 * - Rich info card với hình ảnh và link xem chi tiết
 * - Action link đến trang sản phẩm (/product/slug)
 * 
 * API CALL: GET /api/products/search?keyword=...&limit=1
 */
exports.handleProductDetail = async (parameters, queryResult) => {
  try {
    const productName = parameters['product-name'];

    console.log(`📦 Getting product details - Name: ${productName}`);

    const product = await productService.getProductByName(productName);

    if (!product) {
      return {
        fulfillmentText: `Xin lỗi, tôi không tìm thấy sản phẩm "${productName}". Bạn có thể kiểm tra lại tên sản phẩm không?`
      };
    }

    const detailText = `
📱 ${product.name}
💰 Giá: ${formatters.formatPrice(product.price)}
📦 Tình trạng: ${product.inStock ? 'Còn hàng' : 'Hết hàng'}
⭐ Đánh giá: ${product.rating || 'Chưa có'}/5
🔥 ${product.discount ? `Giảm ${product.discount}%` : 'Không giảm giá'}
    `.trim();

    return {
      fulfillmentText: detailText,
      fulfillmentMessages: [
        {
          text: {
            text: [detailText]
          }
        },
        {
          payload: {
            richContent: [
              [
                {
                  type: 'info',
                  title: product.name,
                  subtitle: formatters.formatPrice(product.price),
                  image: {
                    src: {
                      rawUrl: product.image || 'https://via.placeholder.com/300'
                    }
                  },
                  actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
                }
              ]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleProductDetail:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi lấy thông tin sản phẩm.'
    };
  }
};

/**
 * ==================== ORDER INTENT HANDLERS ====================
 */

/**
 * INTENT: order.track
 * TRIGGER: "Tra cứu đơn hàng", "Kiểm tra đơn ORD-20251115-E4AED6", "Đơn hàng của tôi đâu"
 * 
 * PARAMETERS:
 * - order-id (required): Mã đơn hàng (ví dụ: "ORD-20251115-E4AED6")
 * 
 * RESPONSE:
 * - Thông tin đơn hàng: mã, trạng thái, tổng tiền, ngày đặt, mã vận đơn
 * - Accordion chi tiết: danh sách sản phẩm, địa chỉ giao hàng
 * - Chips: Hủy đơn, Liên hệ hỗ trợ
 * 
 * API CALL: GET /api/orders?search=ORD-20251115-E4AED6&limit=10
 */
exports.handleOrderTrack = async (parameters, queryResult, session) => {
  try {
    const orderId = parameters['order-id'];

    console.log(`📦 Tracking order - ID: ${orderId}`);

    if (!orderId) {
      return {
        fulfillmentText: 'Vui lòng cung cấp mã đơn hàng của bạn. Mã đơn hàng có dạng: ORD-20251118-XXXXXX'
      };
    }

    // TODO: Get user from session/context
    // For now, we'll search by order ID only
    const order = await orderService.getOrderByNumber(orderId);

    if (!order) {
      return {
        fulfillmentText: `Không tìm thấy đơn hàng ${orderId}. Vui lòng kiểm tra lại mã đơn hàng.`
      };
    }

    const statusText = formatters.formatOrderStatus(order.status);
    const orderNumber = order.orderNumber || orderId;
    
    // Format order items for accordion
    const orderItems = order.orderItems || [];
    const itemsList = orderItems.map((item, index) => 
      `${index + 1}. ${item.name}\n   • Số lượng: ${item.qty}\n   • Giá: ${formatters.formatPrice(item.price)}`
    ).join('\n\n');

    const headerText = `📦 **THÔNG TIN ĐƠN HÀNG**\n\n🔖 Mã đơn: **${orderNumber}**\n📍 Trạng thái: **${statusText}**\n💰 Tổng tiền: **${formatters.formatPrice(order.totalPrice)}**\n📅 Ngày đặt: ${formatters.formatDate(order.createdAt)}${order.shippingInfo?.trackingNumber ? `\n🚚 Mã vận đơn: ${order.shippingInfo.trackingNumber}` : ''}`;

    const richContent = [
      [{
        type: 'info',
        title: `Đơn hàng ${orderNumber}`,
        subtitle: `${statusText} • ${formatters.formatPrice(order.totalPrice)}`
      }],
      [{ type: 'divider' }]
    ];

    // Add accordion with order details if items exist
    if (orderItems.length > 0) {
      richContent.push([{
        type: 'accordion',
        title: `📦 Chi tiết đơn hàng (${orderItems.length} sản phẩm)`,
        subtitle: '👇 Nhấn để xem danh sách sản phẩm',
        text: itemsList || 'Không có thông tin chi tiết'
      }]);
    }

    // Add shipping address accordion
    if (order.shippingAddress) {
      const addr = order.shippingAddress;
      richContent.push([{
        type: 'accordion',
        title: '📍 Địa chỉ giao hàng',
        subtitle: `${addr.fullName} - ${addr.phone}`,
        text: `👤 ${addr.fullName}\n📱 ${addr.phone}\n🏠 ${addr.address}, ${addr.ward}, ${addr.district}, ${addr.province}`
      }]);
    }

    richContent.push(
      [{ type: 'divider' }],
      [{ type: 'chips', options: [
        { text: '❌ Hủy đơn hàng' },
        { text: '📞 Liên hệ hỗ trợ' },
        { text: '🏠 Trang chủ' }
      ]}]
    );

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleOrderTrack:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi tra cứu đơn hàng.'
    };
  }
};

/**
 * INTENT: order.cancel
 * TRIGGER: "Hủy đơn hàng", "Huỷ đơn ORD-20251115-E4AED6", "Không muốn mua nữa"
 * 
 * PARAMETERS:
 * - order-id (required): Mã đơn hàng cần hủy
 * 
 * RESPONSE:
 * - Thành công: Hiển thị thông tin hoàn tiền (3-5 ngày)
 * - Thất bại: Hiển thị lý do + hotline hỗ trợ
 * - Chips: Xem đơn hàng khác, Tiếp tục mua sắm
 * 
 * LOGIC:
 * 1. Gọi orderService.getOrderByNumber() để tìm đơn
 * 2. Kiểm tra trạng thái có thể hủy (pending, confirmed, processing)
 * 3. Gọi API PATCH /api/orders/:id/status với status='cancelled'
 * 
 * API CALL: 
 * - GET /api/orders?search=... (tìm đơn)
 * - PATCH /api/orders/:id/status (hủy đơn)
 */
exports.handleOrderCancel = async (parameters, queryResult, session) => {
  try {
    const orderId = parameters['order-id'];

    console.log(`❌ Canceling order - ID: ${orderId}`);

    if (!orderId) {
      return {
        fulfillmentText: 'Vui lòng cung cấp mã đơn hàng bạn muốn hủy.'
      };
    }

    const result = await orderService.cancelOrder(orderId);

    if (result.success) {
      const successText = `✅ **HỦY ĐƠN THÀNH CÔNG**\n\n🔖 Mã đơn: ${orderId}\n\n💳 Hoàn tiền:\n• Thời gian: 3-5 ngày làm việc\n• Phương thức: Hoàn về tài khoản gốc\n\n📞 Cần hỗ trợ? Liên hệ: 1900-xxxx`;
      
      return {
        fulfillmentText: successText,
        fulfillmentMessages: [
          {
            text: {
              text: [successText]
            }
          },
          {
            payload: {
              richContent: [
                [{ type: 'divider' }],
                [{ type: 'chips', options: [
                  { text: '📦 Xem đơn hàng khác' },
                  { text: '🛍️ Tiếp tục mua sắm' },
                  { text: '📞 Liên hệ hỗ trợ' }
                ]}]
              ]
            }
          }
        ]
      };
    } else {
      const errorText = `❌ **KHÔNG THỂ HỦY ĐƠN**\n\n${result.message || 'Đơn hàng không thể hủy ở trạng thái hiện tại'}\n\n📞 Vui lòng liên hệ: 1900-xxxx`;
      
      return {
        fulfillmentText: errorText,
        fulfillmentMessages: [
          {
            text: {
              text: [errorText]
            }
          },
          {
            payload: {
              richContent: [
                [{ type: 'chips', options: [
                  { text: '📦 Kiểm tra đơn hàng' },
                  { text: '📞 Gọi hotline' }
                ]}]
              ]
            }
          }
        ]
      };
    }

  } catch (error) {
    console.error('Error in handleOrderCancel:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi hủy đơn hàng.'
    };
  }
};

/**
 * ==================== PROMOTION INTENT HANDLERS ====================
 */

/**
 * INTENT: promotion.check
 * TRIGGER: "Khuyến mãi gì", "Có giảm giá không", "Mã giảm giá hiện tại"
 * 
 * PARAMETERS: Không có
 * 
 * RESPONSE:
 * - Danh sách chương trình khuyến mãi hiện tại
 * - Mỗi promotion hiển thị trong accordion: tiêu đề, mã, mô tả, điều kiện
 * - Info card hướng dẫn sử dụng mã
 * - Chips: Mua ngay, Xem sản phẩm
 * 
 * TODO: Tích hợp với promotion service thật thay vì hardcode
 * 
 * API CALL: Hiện tại chưa có (dùng data giả)
 */
exports.handlePromotionCheck = async (parameters, queryResult) => {
  try {
    console.log(`🎁 Checking promotions`);

    // TODO: Call promotion service
    const promotions = [
      { title: 'Flash Sale 12.12', discount: '50%', code: 'FLASH1212', desc: 'Giảm đến 50% cho tất cả sản phẩm\nÁp dụng: Tất cả danh mục\nThời gian: 12/12/2025' },
      { title: 'Giảm 1 triệu cho iPhone', discount: '1.000.000đ', code: 'IPHONE1M', desc: 'Giảm ngay 1 triệu đồng\nÁp dụng: Dòng iPhone 15, 16\nĐơn tối thiểu: 15 triệu' },
      { title: 'Trả góp 0% - Không lãi suất', discount: 'Trả góp 0%', code: 'TRAGOP0', desc: 'Trả góp 0% lãi suất\nÁp dụng: Tất cả điện thoại\nThời gian: 6-12 tháng' }
    ];

    const headerText = `🎁 **CHƯƠNG TRÌNH KHUYẾN MÃI**\n\n🔥 Đang có ${promotions.length} chương trình hot!\n\n👇 Nhấn để xem chi tiết:`;

    const promoAccordions = promotions.map(promo => ({
      type: 'accordion',
      title: `${promo.title} - ${promo.discount}`,
      subtitle: `Mã: ${promo.code}`,
      text: promo.desc
    }));

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              promoAccordions,
              [{ type: 'divider' }],
              [{
                type: 'info',
                title: '💡 Cách sử dụng mã',
                subtitle: 'Nhập mã tại trang thanh toán để nhận ưu đãi'
              }],
              [{ type: 'chips', options: [
                { text: '🛍️ Mua ngay' },
                { text: '📱 Xem sản phẩm' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handlePromotionCheck:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi kiểm tra khuyến mãi.'
    };
  }
};

/**
 * ==================== COMPARISON INTENT HANDLERS ====================
 */

/**
 * INTENT: price.compare
 * TRIGGER: "So sánh iPhone 15 và Samsung S24", "Nên mua Oppo hay Xiaomi"
 * 
 * PARAMETERS:
 * - product-name-1 (required): Tên sản phẩm thứ nhất
 * - product-name-2 (required): Tên sản phẩm thứ hai
 * 
 * RESPONSE:
 * - Accordion cho mỗi sản phẩm: giá, đánh giá, tình trạng
 * - Info card kết luận: sản phẩm nào rẻ hơn, chênh lệch bao nhiêu
 * - Chips với link trực tiếp đến từng sản phẩm
 * 
 * LOGIC:
 * 1. Gọi productService.getProductByName() cho 2 sản phẩm
 * 2. So sánh giá, tính chênh lệch
 * 3. Hiển thị thông tin chi tiết và kết luận
 * 
 * API CALL: GET /api/products/search?keyword=...&limit=1 (gọi 2 lần)
 */
exports.handlePriceCompare = async (parameters, queryResult) => {
  try {
    const product1Name = parameters['product-name-1'];
    const product2Name = parameters['product-name-2'];

    console.log(`⚖️ Comparing products - ${product1Name} vs ${product2Name}`);

    if (!product1Name || !product2Name) {
      return {
        fulfillmentText: 'Vui lòng cung cấp tên 2 sản phẩm để so sánh. Ví dụ: "So sánh iPhone 15 và Samsung S24"'
      };
    }

    const product1 = await productService.getProductByName(product1Name);
    const product2 = await productService.getProductByName(product2Name);

    if (!product1 || !product2) {
      return {
        fulfillmentText: 'Không tìm thấy một hoặc cả hai sản phẩm. Vui lòng kiểm tra lại tên sản phẩm.'
      };
    }

    const priceDiff = Math.abs(product1.price - product2.price);
    const cheaper = product1.price < product2.price ? product1 : product2;
    const moreExpensive = product1.price < product2.price ? product2 : product1;

    const headerText = `⚖️ **SO SÁNH SẢN PHẨM**\n\n💡 ${cheaper.name} **rẻ hơn** ${formatters.formatPrice(priceDiff)}`;

    const product1Details = `📱 **${product1.name}**\n\n💰 Giá: ${formatters.formatPrice(product1.price)}\n⭐ Đánh giá: ${product1.rating || 'N/A'}/5\n📦 Tình trạng: ${product1.inStock ? 'Còn hàng' : 'Hết hàng'}`;
    
    const product2Details = `📱 **${product2.name}**\n\n💰 Giá: ${formatters.formatPrice(product2.price)}\n⭐ Đánh giá: ${product2.rating || 'N/A'}/5\n📦 Tình trạng: ${product2.inStock ? 'Còn hàng' : 'Hết hàng'}`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              [{
                type: 'accordion',
                title: `${product1.name}`,
                subtitle: formatters.formatPrice(product1.price),
                text: product1Details
              }],
              [{
                type: 'accordion',
                title: `${product2.name}`,
                subtitle: formatters.formatPrice(product2.price),
                text: product2Details
              }],
              [{ type: 'divider' }],
              [{
                type: 'info',
                title: '💰 Kết luận',
                subtitle: `${cheaper.name} rẻ hơn ${formatters.formatPrice(priceDiff)}`
              }],
              [{ type: 'chips', options: [
                { text: `Xem ${product1.name}`, link: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product1.slug || product1._id}` },
                { text: `Xem ${product2.name}`, link: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product2.slug || product2._id}` }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handlePriceCompare:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi so sánh sản phẩm.'
    };
  }
};

/**
 * ==================== ADDITIONAL PRODUCT SEARCH HANDLERS ====================
 */

/**
 * INTENT: product.search.by-color
 * TRIGGER: "Tìm điện thoại màu đen", "Xem iPhone màu hồng", "Có Samsung xanh không"
 * 
 * PARAMETERS:
 * - color-name (required): Màu sắc (có thể nhiều màu)
 * - brand-name (optional): Thương hiệu
 * - price-range (optional): Khoảng giá
 * - max-price (optional): Giá tối đa
 * 
 * RESPONSE:
 * - Rich content cards với sản phẩm theo màu
 * - Highlight màu sắc trong subtitle
 * - Chips gợi ý màu khác
 * 
 * API CALL: GET /api/products/search?color=...&brand=...&limit=5
 */
exports.handleProductSearchByColor = async (parameters, queryResult) => {
  try {
    const colors = parameters['color-name'];
    const brand = parameters['brand-name'];
    const priceRange = parameters['price-range'];
    
    console.log(`🎨 Searching products - Color: ${colors}, Brand: ${brand}`);

    // TODO: Implement color search in product service
    // For now, search by brand and filter by color manually
    const products = await productService.searchProductsByBrand({
      brand: brand || undefined,
      category: 'dien-thoai',
      limit: 5
    });

    if (!products || products.length === 0) {
      const colorText = Array.isArray(colors) ? colors.join(', ') : colors;
      return {
        fulfillmentText: `Xin lỗi, hiện tại chúng tôi không có điện thoại màu ${colorText}${brand ? ` của ${brand}` : ''}. Bạn muốn xem màu khác không?`,
        fulfillmentMessages: [
          {
            text: {
              text: [`Không tìm thấy điện thoại màu ${colorText}. Thử màu khác nhé!`]
            }
          },
          {
            payload: {
              richContent: [
                [{ type: 'chips', options: [
                  { text: '⚫ Màu đen' },
                  { text: '⚪ Màu trắng' },
                  { text: '🔵 Màu xanh' },
                  { text: '🌸 Màu hồng' }
                ]}]
              ]
            }
          }
        ]
      };
    }

    const colorText = Array.isArray(colors) ? colors.join(', ') : colors;
    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)} • 🎨 ${colorText}${product.brand ? ` • ${product.brand.name}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerText = `🎨 Tìm thấy ${products.length} điện thoại màu ${colorText}\n\n✨ Nhấn vào sản phẩm để xem chi tiết:`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              productCards,
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '⚫ Xem màu đen' },
                { text: '⚪ Xem màu trắng' },
                { text: '🔵 Xem màu xanh' },
                { text: '🏠 Trang chủ' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleProductSearchByColor:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi tìm kiếm theo màu sắc.'
    };
  }
};

/**
 * INTENT: product.search.by-memory
 * TRIGGER: "Tìm điện thoại 128GB", "iPhone 256GB", "Điện thoại dung lượng lớn"
 * 
 * PARAMETERS:
 * - memory-capacity (required): Dung lượng (VD: "128gb", "256gb")
 * - brand-name (optional): Thương hiệu
 * - price-range (optional): Khoảng giá
 * 
 * RESPONSE:
 * - Rich content cards với sản phẩm theo dung lượng
 * - Highlight dung lượng trong subtitle
 * - Chips gợi ý dung lượng khác
 * 
 * API CALL: GET /api/products/search?memory=...&brand=...&limit=5
 */
exports.handleProductSearchByMemory = async (parameters, queryResult) => {
  try {
    const memory = parameters['memory-capacity'];
    const brand = parameters['brand-name'];
    
    console.log(`💾 Searching products - Memory: ${memory}, Brand: ${brand}`);

    // TODO: Implement memory search in product service
    const products = await productService.searchProductsByBrand({
      brand: brand || undefined,
      category: 'dien-thoai',
      limit: 5
    });

    if (!products || products.length === 0) {
      return {
        fulfillmentText: `Xin lỗi, hiện tại chúng tôi không có điện thoại ${memory}${brand ? ` của ${brand}` : ''}. Bạn muốn xem dung lượng khác không?`,
        fulfillmentMessages: [
          {
            text: {
              text: [`Không tìm thấy điện thoại ${memory}. Thử dung lượng khác nhé!`]
            }
          },
          {
            payload: {
              richContent: [
                [{ type: 'chips', options: [
                  { text: '💾 128GB' },
                  { text: '💾 256GB' },
                  { text: '💾 512GB' },
                  { text: '💾 1TB' }
                ]}]
              ]
            }
          }
        ]
      };
    }

    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)} • 💾 ${memory.toUpperCase()}${product.brand ? ` • ${product.brand.name}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerText = `💾 Tìm thấy ${products.length} điện thoại ${memory.toUpperCase()}\n\n✨ Nhấn vào sản phẩm để xem chi tiết:`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              productCards,
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '💾 128GB' },
                { text: '💾 256GB' },
                { text: '💾 512GB' },
                { text: '🏠 Trang chủ' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleProductSearchByMemory:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi tìm kiếm theo dung lượng.'
    };
  }
};

/**
 * ==================== POLICY HANDLERS ====================
 */

/**
 * INTENT: policy.shipping, policy.return, policy.warranty, policy.payment
 * TRIGGER: "Chính sách giao hàng", "Đổi trả như thế nào", "Bảo hành bao lâu"
 * 
 * PARAMETERS: Không có
 * 
 * RESPONSE:
 * - Accordion cho từng chính sách
 * - Info card với highlight
 * - Chips liên hệ hỗ trợ
 */
exports.handlePolicyQuestions = async (intentName, parameters, queryResult) => {
  try {
    console.log(`📋 Policy question - Intent: ${intentName}`);

    const policies = {
      'policy.shipping': {
        title: '🚚 CHÍNH SÁCH GIAO HÀNG',
        icon: '🚚',
        items: [
          {
            title: '⚡ Giao hàng nhanh',
            text: '• Nội thành: 2-4 giờ\n• Ngoại thành: 1-2 ngày\n• Tỉnh xa: 2-3 ngày\n• Miễn phí ship đơn > 500k'
          },
          {
            title: '📦 Kiểm tra hàng',
            text: '• Được mở hộp kiểm tra trước khi nhận\n• Từ chối nếu sản phẩm không đúng\n• Đổi trả ngay nếu có lỗi'
          }
        ],
        hotline: '1900-xxxx'
      },
      'policy.return': {
        title: '🔄 CHÍNH SÁCH ĐỔI TRẢ',
        icon: '🔄',
        items: [
          {
            title: '⏰ Thời gian đổi trả',
            text: '• 7 ngày đầu: Đổi trả miễn phí\n• Lỗi nhà sản xuất: Đổi mới 100%\n• Đổi ý: Hoàn 90% giá trị'
          },
          {
            title: '📝 Điều kiện',
            text: '• Còn nguyên hộp, phụ kiện\n• Chưa qua sử dụng\n• Có hóa đơn mua hàng'
          }
        ],
        hotline: '1900-xxxx'
      },
      'policy.warranty': {
        title: '🛡️ CHÍNH SÁCH BẢO HÀNH',
        icon: '🛡️',
        items: [
          {
            title: '⏱️ Thời gian bảo hành',
            text: '• Điện thoại: 12 tháng\n• Pin, sạc: 6 tháng\n• Phụ kiện: 3 tháng\n• Bảo hành tại nhà sản xuất'
          },
          {
            title: '🔧 Dịch vụ bảo hành',
            text: '• Miễn phí vệ sinh máy\n• Kiểm tra định kỳ\n• Hỗ trợ kỹ thuật 24/7\n• Bảo hành tận nơi (VIP)'
          }
        ],
        hotline: '1900-xxxx'
      },
      'policy.payment': {
        title: '💳 PHƯƠNG THỨC THANH TOÁN',
        icon: '💳',
        items: [
          {
            title: '💵 Thanh toán khi nhận hàng (COD)',
            text: '• Thanh toán tiền mặt khi nhận\n• Không mất phí COD\n• An toàn, tiện lợi'
          },
          {
            title: '💳 Thanh toán online',
            text: '• Ví điện tử: MoMo, ZaloPay, VNPay\n• Thẻ tín dụng/ghi nợ\n• Chuyển khoản ngân hàng\n• Giảm thêm 2% khi thanh toán online'
          },
          {
            title: '🏦 Trả góp 0%',
            text: '• Trả góp qua thẻ tín dụng\n• Lãi suất 0%\n• Thời gian: 6-12 tháng\n• Duyệt nhanh trong 15 phút'
          }
        ],
        hotline: '1900-xxxx'
      }
    };

    const policy = policies[intentName];
    if (!policy) {
      return {
        fulfillmentText: 'Xin lỗi, tôi không tìm thấy thông tin chính sách này.'
      };
    }

    const accordions = policy.items.map(item => ({
      type: 'accordion',
      title: item.title,
      subtitle: '👇 Nhấn để xem chi tiết',
      text: item.text
    }));

    const headerText = `${policy.icon} **${policy.title}**\n\n👇 Nhấn để xem chi tiết:`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              accordions,
              [{ type: 'divider' }],
              [{
                type: 'info',
                title: '📞 Cần hỗ trợ thêm?',
                subtitle: `Hotline: ${policy.hotline} (24/7)`
              }],
              [{ type: 'chips', options: [
                { text: '📞 Gọi hotline' },
                { text: '💬 Chat với tư vấn viên' },
                { text: '🏠 Trang chủ' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handlePolicyQuestions:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra khi lấy thông tin chính sách.'
    };
  }
};

/**
 * ==================== SUPPORT HANDLERS ====================
 */

/**
 * INTENT: contact.support
 * TRIGGER: "Liên hệ hỗ trợ", "Gọi tổng đài", "Chat với tư vấn viên"
 * 
 * PARAMETERS: Không có
 * 
 * RESPONSE:
 * - Thông tin liên hệ đầy đủ
 * - Buttons gọi điện, chat
 * - Giờ làm việc
 */
exports.handleContactSupport = async (parameters, queryResult) => {
  try {
    console.log(`📞 Contact support request`);

    const headerText = `📞 **LIÊN HỆ HỖ TRỢ**\n\n🎧 Chúng tôi luôn sẵn sàng hỗ trợ bạn!`;

    return {
      fulfillmentText: headerText,
      fulfillmentMessages: [
        {
          text: {
            text: [headerText]
          }
        },
        {
          payload: {
            richContent: [
              [{
                type: 'accordion',
                title: '📞 Hotline - 1900-xxxx',
                subtitle: 'Hỗ trợ 24/7 - Miễn phí cuộc gọi',
                text: '• Hỗ trợ 24/7\n• Miễn phí cuộc gọi\n• Tư vấn viên chuyên nghiệp'
              }],
              [{
                type: 'accordion',
                title: '💬 Chat trực tuyến',
                subtitle: 'Phản hồi trong 1 phút',
                text: '• Phản hồi trong 1 phút\n• Hỗ trợ qua Facebook, Zalo\n• Chat ngay trên website'
              }],
              [{
                type: 'accordion',
                title: '📧 Email - support@smartbuy.vn',
                subtitle: 'Phản hồi trong 24h',
                text: '• Phản hồi trong 24h\n• Gửi khiếu nại, góp ý\n• Hỗ trợ kỹ thuật'
              }],
              [{
                type: 'accordion',
                title: '🏢 Địa chỉ showroom',
                subtitle: 'Mở cửa: 8h - 22h (Hằng ngày)',
                text: '• 123 Đường ABC, Quận 1, TP.HCM\n• 456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội\n• Mở cửa: 8h - 22h (Hằng ngày)'
              }],
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '📞 Gọi ngay 1900-xxxx' },
                { text: '💬 Chat Facebook' },
                { text: '💬 Chat Zalo' },
                { text: '🏠 Trang chủ' }
              ]}]
            ]
          }
        }
      ]
    };

  } catch (error) {
    console.error('Error in handleContactSupport:', error);
    return {
      fulfillmentText: 'Có lỗi xảy ra. Vui lòng gọi hotline 1900-xxxx để được hỗ trợ.'
    };
  }
};
