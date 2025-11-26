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
 * - brand-name (optional): Thương hiệu (ví dụ: "apple", "samsung")
 * - min-price (optional): Giá tối thiểu (số, đơn vị triệu)
 * - max-price (optional): Giá tối đa (số, đơn vị triệu)
 * 
 * RESPONSE: 
 * - Rich content cards hiển thị danh sách sản phẩm
 * - Suggestion chips gợi ý thương hiệu và mức giá
 * 
 * API CALL: GET /api/products/search?category=...&priceRange=...&brand=...&limit=5
 */
exports.handleProductSearch = async (parameters, queryResult) => {
  try {
    const category = parameters['product-category'];
    let priceRange = parameters['price-range'];
    const brand = parameters['brand-name'];
    let minPrice = parameters['min-price'] || parameters['min_price'];
    let maxPrice = parameters['max-price'] || parameters['max_price'];

    console.log(`🔍 Searching products:`, { category, priceRange, brand, minPrice, maxPrice });

    // Parse price-range nếu có format "X-Y triệu" và chưa có min/max
    if (priceRange) {
      const priceMatch = priceRange.match(/(\d+)-(\d+)\s*(triệu|tr|củ)/i);
      if (priceMatch && !minPrice && !maxPrice) {
        minPrice = parseInt(priceMatch[1]);
        maxPrice = parseInt(priceMatch[2]);
        priceRange = null; // Clear priceRange, sẽ dùng min/max
        console.log(`📊 Parsed price range "${parameters['price-range']}" → ${minPrice}-${maxPrice} triệu`);
      }
    }

    // Convert triệu → VND nếu có min/max price
    let useNumericPrice = false;
    if (minPrice || maxPrice) {
      if (minPrice) minPrice = minPrice * 1000000;
      if (maxPrice) maxPrice = maxPrice * 1000000;
      
      // Fix: Dialogflow đôi khi extract sai thứ tự (VD: "10-20 triệu" → min=20, max=10)
      if (minPrice && maxPrice && minPrice > maxPrice) {
        console.log(`⚠️ Swapping min/max: ${minPrice} <-> ${maxPrice}`);
        [minPrice, maxPrice] = [maxPrice, minPrice];
      }
      
      useNumericPrice = true;
      console.log(`💰 Using numeric price: ${minPrice || 0} - ${maxPrice || 'unlimited'} VND`);
    }

    // Call appropriate API based on parameters
    let products;
    if (useNumericPrice) {
      // Use numeric price API
      if (!minPrice) minPrice = 0;
      if (!maxPrice) maxPrice = 100000000;
      
      products = await productService.searchProductsByPrice({
        minPrice,
        maxPrice,
        category,
        brand,
        limit: 5
      });
    } else {
      // Use priceRange API
      products = await productService.searchProducts({
        category,
        priceRange,
        brand,
        limit: 5
      });
    }

    if (!products || products.length === 0) {
      return {
        fulfillmentText: `Xin lỗi, hiện tại chúng tôi không có ${brand ? brand + ' ' : ''}điện thoại nào phù hợp với tiêu chí tìm kiếm. Bạn có thể thử tìm với thương hiệu hoặc mức giá khác không?`,
        fulfillmentMessages: [
          {
            text: {
              text: [`Không tìm thấy ${brand ? brand + ' ' : ''}điện thoại phù hợp. Bạn muốn xem thương hiệu nào? (iPhone, Samsung, Oppo, Xiaomi...)`]
            }
          },
          {
            payload: {
              richContent: [
                [{ type: 'chips', options: [
                  { text: 'Điện thoại iPhone' },
                  { text: 'Điện thoại Samsung' },
                  { text: 'Điện thoại Oppo' },
                  { text: 'Điện thoại Xiaomi' }
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
      subtitle: `💰 ${formatters.formatPrice(product.price)}${product.brand ? ` • ${product.brand}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    // Build header text with dynamic info
    let headerParts = [`🔍 Tìm thấy ${products.length} sản phẩm`];
    if (brand) headerParts.push(brand);
    if (useNumericPrice) {
      headerParts.push(`\n📊 Khoảng giá: ${formatters.formatPrice(minPrice)} - ${formatters.formatPrice(maxPrice)}`);
    } else if (priceRange) {
      const priceRangeText = {
        'duoi-3-trieu': 'dưới 3 triệu',
        'duoi-5-trieu': 'dưới 5 triệu',
        'duoi-10-trieu': 'dưới 10 triệu',
        '3-5-trieu': '3-5 triệu',
        '5-10-trieu': '5-10 triệu',
        '10-15-trieu': '10-15 triệu',
        '15-20-trieu': '15-20 triệu',
        '20-30-trieu': '20-30 triệu'
      };
      headerParts.push(`\n📊 Khoảng giá: ${priceRangeText[priceRange] || priceRange}`);
    }
    headerParts.push('\n\n✨ Xem chi tiết bằng cách nhấn vào sản phẩm bên dưới:');

    const responseText = headerParts.join(' ');

    // Suggestion chips
    const suggestionChips = [
      { type: 'chips', options: [
        { text: 'Điện thoại iPhone' },
        { text: 'Điện thoại Samsung' },
        { text: 'Điện thoại dưới 5 triệu' },
        { text: 'Khuyến mãi' }
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

    const headerParts = [`🔍 Tìm thấy ${products.length} sản phẩm ${brand}`];
    headerParts.push('\n\n✨ Nhấn vào sản phẩm để xem chi tiết:');
    const headerText = headerParts.join('\n');

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
                { text: 'Tìm thương hiệu khác' },
                { text: 'Lọc theo giá' },
                { text: 'Chính sách mua hàng' }
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
    // Check nếu có priceRange (string) hoặc min/max price (number)
    const priceRange = parameters['price-range'];
    const brand = parameters['brand-name'];
    let minPrice = parameters['min-price'] || parameters['min_price'];
    let maxPrice = parameters['max-price'] || parameters['max_price'];
    const category = parameters['product-category'];

    console.log(`🔍 Search by price params:`, { priceRange, brand, minPrice, maxPrice, category });

    // Nếu có priceRange (VD: "5-10-trieu"), ưu tiên dùng priceRange
    if (priceRange) {
      // Nếu priceRange không match với entity chuẩn, parse từ text
      // VD: "5-15 triệu" → minPrice=5M, maxPrice=15M
      const priceMatch = priceRange.match(/(\d+)-(\d+)\s*(triệu|tr|củ)/i);
      if (priceMatch && !minPrice && !maxPrice) {
        minPrice = parseInt(priceMatch[1]) * 1000000;
        maxPrice = parseInt(priceMatch[2]) * 1000000;
        console.log(`📊 Parsed price range "${priceRange}" → ${minPrice}-${maxPrice}`);
        // Fall through to numeric handling below
      } else {
        // Dùng API với priceRange (backend đã có logic xử lý)
        const products = await productService.searchProducts({
          priceRange,
          brand,
          category,
          limit: 5
        });

        if (!products || products.length === 0) {
          return {
            fulfillmentText: `Không tìm thấy sản phẩm${brand ? ` ${brand}` : ''} trong khoảng giá này. Bạn muốn xem khoảng giá khác không?`
          };
        }

        // Map priceRange to display text
        const priceRangeText = {
          // Khoảng giá cụ thể
          '3-5-trieu': '3-5 triệu',
          '5-10-trieu': '5-10 triệu',
          '10-15-trieu': '10-15 triệu',
          '15-20-trieu': '15-20 triệu',
          '20-30-trieu': '20-30 triệu',
          // Dưới X triệu (entity value)
          'duoi-3-trieu': 'dưới 3 triệu',
          'duoi-5-trieu': 'dưới 5 triệu',
          'duoi-10-trieu': 'dưới 10 triệu',
          'duoi-15-trieu': 'dưới 15 triệu',
          'duoi-20-trieu': 'dưới 20 triệu',
          'duoi-30-trieu': 'dưới 30 triệu',
          // Trên X triệu (entity value)
          'tren-20-trieu': 'trên 20 triệu',
          'tren-30-trieu': 'trên 30 triệu',
          // Text tự do fallback
          'dưới 3 triệu': 'dưới 3 triệu',
          'dưới 5 triệu': 'dưới 5 triệu',
          'dưới 10 triệu': 'dưới 10 triệu',
          'dưới 15 triệu': 'dưới 15 triệu',
          'dưới 20 triệu': 'dưới 20 triệu',
          'dưới 30 triệu': 'dưới 30 triệu',
          'trên 20 triệu': 'trên 20 triệu',
          'trên 30 triệu': 'trên 30 triệu'
        };

        const productCards = products.map(product => ({
          type: 'info',
          title: product.name,
          subtitle: `💰 ${formatters.formatPrice(product.price)}${product.brand ? ` • ${product.brand}` : ''}`,
          image: {
            src: {
              rawUrl: product.image || 'https://via.placeholder.com/300'
            }
          },
          actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
        }));

        const headerParts = [`💰 Tìm thấy ${products.length} sản phẩm${brand ? ` ${brand}` : ''}`];
        headerParts.push(`📊 Khoảng giá: ${priceRangeText[priceRange] || priceRange}`);
        headerParts.push('\n✨ Các sản phẩm phù hợp với ngân sách của bạn:');
        const headerText = headerParts.join('\n');

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
                    { text: 'Dưới 5 triệu' },
                    { text: '5-10 triệu' },
                    { text: '10-20 triệu' },
                    { text: 'Trên 20 triệu' }
                  ]}]
                ]
              }
            }
          ]
        };
      }
    }

    // Nếu không có priceRange, dùng minPrice/maxPrice
    // Dialogflow gửi giá theo triệu (VD: 10 = 10 triệu)
    // Cần convert sang VND (10 triệu = 10,000,000 VND)
    if (minPrice) minPrice = minPrice * 1000000;
    if (maxPrice) maxPrice = maxPrice * 1000000;

    // Fix: Dialogflow đôi khi extract sai thứ tự (VD: "10-20 triệu" → min=20, max=10)
    // Swap nếu min > max
    if (minPrice && maxPrice && minPrice > maxPrice) {
      console.log(`⚠️ Swapping min/max: ${minPrice} <-> ${maxPrice}`);
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    // Default values nếu không có
    if (!minPrice) minPrice = 0;
    if (!maxPrice) maxPrice = 100000000; // 100 triệu

    console.log(`🔍 Searching products - Price: ${minPrice}-${maxPrice} VND, Brand: ${brand}, Category: ${category}`);

    const products = await productService.searchProductsByPrice({
      minPrice,
      maxPrice,
      category,
      brand,
      limit: 5
    });

    if (!products || products.length === 0) {
      return {
        fulfillmentText: `Không tìm thấy sản phẩm${brand ? ` ${brand}` : ''} trong khoảng giá ${formatters.formatPrice(minPrice)} - ${formatters.formatPrice(maxPrice)}. Bạn muốn xem khoảng giá khác không?`
      };
    }

    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)}${product.brand ? ` • ${product.brand}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerParts = [`💰 Tìm thấy ${products.length} sản phẩm${brand ? ` ${brand}` : ''}`];
    headerParts.push(`📊 Khoảng giá: ${formatters.formatPrice(minPrice)} - ${formatters.formatPrice(maxPrice)}`);
    headerParts.push('\n✨ Các sản phẩm phù hợp với ngân sách của bạn:');
    const headerText = headerParts.join('\n');

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
                { text: 'Dưới 5 triệu' },
                { text: '5-10 triệu' },
                { text: '10-20 triệu' },
                { text: 'Trên 20 triệu' }
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


    // Lấy trực tiếp averageRating từ review-service
    let ratingText = 'Chưa có đánh giá nào';
    try {
      const axios = require('axios');
      const reviewRes = await axios.get(`http://localhost:3000/api/reviews/product/${product._id}`);
      const stats = reviewRes.data.data.stats;
      
        ratingText = stats.averageRating.toFixed(1) + ' sao từ ' + stats.totalReviews + ' đánh giá';
       
    } catch (err) {
      console.error('Không lấy được rating từ review-service:', err?.message || err);
    }

    // Build detailed info sections
    const priceInfo = `💰 **Giá bán:** ${formatters.formatPrice(product.price)}`;
    const stockInfo = `📦 **Tình trạng:** ${product.inStock ? 'Còn hàng ✅' : 'Hết hàng ❌'}`;
    const ratingInfo = `⭐ **Đánh giá:** ${ratingText}`;
    const discountInfo = product.discount 
      ? `🔥 **Khuyến mãi:** Giảm ${product.discount}%` 
      : `💎 **Giá gốc:** Không có chương trình giảm giá`;

    const fulfillmentText = `🔥 Thông tin chi tiết về sản phẩm 🔥`;

    return {
      fulfillmentText: fulfillmentText,
      fulfillmentMessages: [
        {
          text: {
            text: [fulfillmentText]
          }
        },
        {
          payload: {
            richContent: [
              [
                {
                  type: 'info',
                  title: `💰 Giá bán`,
                  subtitle: formatters.formatPrice(product.price)
                }
              ],
              [
                {
                  type: 'info',
                  title: `📦 Tình trạng`,
                  subtitle: product.inStock ? 'Còn hàng ✅' : 'Hết hàng ❌'
                }
              ],
              [
                {
                  type: 'info',
                  title: `⭐ Đánh giá`,
                  subtitle: ratingText
                }
              ],
              [
                {
                  type: 'info',
                  title: product.discount ? `🔥 Khuyến mãi` : `💎 Giá gốc`,
                  subtitle: product.discount ? `Giảm ${product.discount}%` : 'Không có chương trình giảm giá'
                }
              ],
              [
                {
                  type: 'info',
                  title: product.name,
                  subtitle: `💰 ${formatters.formatPrice(product.price)} • ${product.inStock ? '✅ Còn hàng' : '❌ Hết hàng'}`,
                  image: {
                    src: {
                      rawUrl: product.image || 'https://via.placeholder.com/300'
                    }
                  },
                  actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
                }
              ],
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '📱 Tìm sản phẩm khác' },
                { text: '🎁 Xem khuyến mãi' }
              ]}]
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
      `${index + 1}. ${item.name}<br/>   • Số lượng: ${item.qty}<br/>   • Giá: ${formatters.formatPrice(item.price)}`
    ).join('<br/><br/>');

    const headerText = `📦 **THÔNG TIN ĐƠN HÀNG** 📦`;

    const richContent = [
      [{
        type: 'info',
        title: `Đơn hàng ${orderNumber}`,
        subtitle: `${statusText} • Tổng tiền: ${formatters.formatPrice(order.totalPrice)}`
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
        text: `👤 ${addr.fullName}<br/>📱 ${addr.phone}<br/>🏠 ${addr.address}, ${addr.ward}, ${addr.district}, ${addr.province}`
      }]);
    }

    richContent.push(
      [{ type: 'divider' }],
      [{ type: 'chips', options: [
        { 
          text: '🌐 Quản lý đơn hàng',
          link: `${process.env.CORS_ORIGIN?.split(',')[0]}/account/orders`
        },
        { text: '📞 Liên hệ hỗ trợ' },
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
 * - order-id (optional): Mã đơn hàng cần hủy
 * 
 * RESPONSE:
 * - Hướng dẫn user đến trang quản lý đơn hàng để hủy an toàn
 * - Hoặc liên hệ hotline để được hỗ trợ
 * - Chips: Link đến trang đơn hàng, Gọi hotline
 * 
 * LOGIC:
 * Không hủy trực tiếp qua chatbox vì:
 * - Không xác thực được người dùng
 * - Rủi ro bảo mật cao
 * - Cần confirm và xác nhận rõ ràng
 */
exports.handleOrderCancel = async (parameters, queryResult, session) => {
  try {
    const orderId = parameters['order-id'];

    console.log(`❌ Order cancel request - ID: ${orderId}`);

    const headerParts = ['❌ **YÊU CẦU HỦY ĐƠN HÀNG**'];
    headerParts.push('\nĐể đảm bảo an toàn và xác thực, vui lòng:');
    const headerText = headerParts.join('\n');

    const guideText = `📱 **CÁCH HỦY ĐƠN HÀNG:**<br/><br/>**1️⃣ Qua website:**<br/>• Đăng nhập tài khoản<br/>• Vào "Đơn hàng của tôi"<br/>• Chọn đơn cần hủy → Nhấn "Hủy đơn"<br/>• Xác nhận và hoàn tiền 3-5 ngày<br/><br/>**2️⃣ Qua hotline:**<br/>• Gọi: 1900-xxxx (miễn phí)<br/>• Cung cấp mã đơn: ${orderId || '(chưa có)'}`;

    const richContent = [
      [{
        type: 'accordion',
        title: '📱 Hướng dẫn hủy đơn hàng',
        subtitle: '👇 Nhấn để xem chi tiết',
        text: guideText
      }],
      [{ type: 'divider' }],
      [{
        type: 'info',
        title: '⚠️ Lưu ý quan trọng',
        subtitle: 'Vì sao không thể hủy trực tiếp qua chatbox?'
      }],
      [{
        type: 'description',
        title: 'Lý do bảo mật:',
        text: [
          '🔒 Cần xác thực người dùng',
          '✅ Tránh hủy nhầm hoặc lợi dụng',
          '💳 Đảm bảo quy trình hoàn tiền chính xác',
          '📋 Lưu lại lịch sử hủy đơn'
        ]
      }],
      [{ type: 'divider' }]
    ];

    // Add chips with links
    const chips = [{
      type: 'chips',
      options: []
    }];

    if (orderId) {
      chips[0].options.push({
        text: '🌐 Mở trang đơn hàng',
        link: `${process.env.CORS_ORIGIN?.split(',')[0]}/account/orders`
      });
    } else {
      chips[0].options.push({
        text: '🌐 Xem đơn hàng của tôi',
        link: `${process.env.CORS_ORIGIN?.split(',')[0]}/account/orders`
      });
    }

    chips[0].options.push(
      { text: '📞 Gọi hotline 1900-xxxx' },
      { text: '💬 Chat với CSKH' },
      { text: '📦 Tra cứu đơn hàng' }
    );

    richContent.push(chips);

    return {
      fulfillmentText: headerText + '\n\n1️⃣ Vào website → Đơn hàng của tôi → Hủy đơn\n2️⃣ Gọi hotline: 1900-xxxx',
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
    console.error('Error in handleOrderCancel:', error);
    return {
      fulfillmentText: 'Vui lòng liên hệ hotline 1900-xxxx để được hỗ trợ hủy đơn hàng.'
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
      { title: '🔥 Flash Sale 12.12', discount: '50%', code: 'FLASH1212', desc: 'Giảm đến 50% cho tất cả sản phẩm<br/>Áp dụng: Tất cả danh mục<br/>Thời gian: 12/12/2025' },
      { title: '🎁 Giảm 1 triệu cho iPhone', discount: '1.000.000đ', code: 'IPHONE1M', desc: 'Giảm ngay 1 triệu đồng<br/>Áp dụng: Dòng iPhone 15, 16<br/>Đơn tối thiểu: 15 triệu' },
      { title: '🎉Trả góp 0% - Không lãi suất', discount: 'Trả góp 0%', code: 'TRAGOP0', desc: 'Trả góp 0% lãi suất<br/>Áp dụng: Tất cả điện thoại<br/>Thời gian: 6-12 tháng' }
    ];

    const headerParts = ['🎁 CHƯƠNG TRÌNH KHUYẾN MÃI'];
    const headerText = headerParts.join('\n');

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
                { text: 'Chính sách giao hàng' },
                { text: 'Xem thêm điện thoại' }
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
    // Extract product parameters (Dialogflow uses product_1 and product_2)
    const product1Param = parameters['product_1'] || parameters['product-name-1'];
    const product2Param = parameters['product_2'] || parameters['product-name-2'];
    
    // Handle array format from Dialogflow
    const product1Name = Array.isArray(product1Param) ? product1Param[0] : product1Param;
    const product2Name = Array.isArray(product2Param) ? product2Param[0] : product2Param;

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

    const headerParts = ['⚖️ **SO SÁNH SẢN PHẨM** ⚖️'];
    const headerText = headerParts.join('\n');

    const product1Details = `📱 **${product1.name}**<br/><br/>💰 Giá: ${formatters.formatPrice(product1.price)}<br/>⭐ Đánh giá: ${product1.rating || 'N/A'}/5<br/>📦 Tình trạng: ${product1.inStock ? 'Còn hàng' : 'Hết hàng'}`;
    
    const product2Details = `📱 **${product2.name}**<br/><br/>💰 Giá: ${formatters.formatPrice(product2.price)}<br/>⭐ Đánh giá: ${product2.rating || 'N/A'}/5<br/>📦 Tình trạng: ${product2.inStock ? 'Còn hàng' : 'Hết hàng'}`;

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
    
    console.log(`🎨 Searching products - Color: ${colors}, Brand: ${brand}, PriceRange: ${priceRange}`);

    // Call product service with color parameter
    const products = await productService.searchProductsByColor({
      color: Array.isArray(colors) ? colors[0] : colors,
      brand: brand || undefined,
      priceRange: priceRange || undefined,
      category: 'dien-thoai',
      limit: 5
    });

    const colorText = Array.isArray(colors) ? colors.join(', ') : colors;

    if (!products || products.length === 0) {
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

    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)} • 🎨 ${colorText}${product.brand ? ` • ${product.brand}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerParts = [`🎨 Tìm thấy ${products.length} điện thoại màu ${colorText}${brand ? ` ${brand}` : ''}`];
    headerParts.push('\n✨ Nhấn vào sản phẩm để xem chi tiết:');
    const headerText = headerParts.join('\n');

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

    // Call specialized memory search service
    const products = await productService.searchProductsByMemory({
      memory: memory,
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

    // Determine if searching for RAM or ROM
    const isRamSearch = memory.toLowerCase().includes('ram');
    const displayMemory = memory.toUpperCase();
    const memoryEmoji = isRamSearch ? '🧠' : '💾';
    
    const productCards = products.map(product => ({
      type: 'info',
      title: product.name,
      subtitle: `💰 ${formatters.formatPrice(product.price)} • ${memoryEmoji} ${displayMemory}${product.brand ? ` • ${product.brand}` : ''}`,
      image: {
        src: {
          rawUrl: product.image || 'https://via.placeholder.com/300'
        }
      },
      actionLink: `${process.env.CORS_ORIGIN?.split(',')[0]}/product/${product.slug || product._id}`
    }));

    const headerParts = [`${memoryEmoji} Tìm thấy ${products.length} điện thoại ${displayMemory}`];
    headerParts.push('\n\n✨ Nhấn vào sản phẩm để xem chi tiết:');
    const headerText = headerParts.join('\n');

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
                { text: '128GB Rom' },
                { text: '256GB Rom' },
                { text: '512GB Rom' },
                { text: '4GB Ram' },
                { text: '8GB Ram' },
                { text: '12GB Ram' }
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
            text: '• Nội thành: 2-4 giờ<br/>• Ngoại thành: 1-2 ngày<br/>• Tỉnh xa: 2-3 ngày<br/>• Miễn phí ship đơn > 500k'
          },
          {
            title: '📦 Kiểm tra hàng',
            text: '• Được mở hộp kiểm tra trước khi nhận<br/>• Từ chối nếu sản phẩm không đúng<br/>• Đổi trả ngay nếu có lỗi'
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
            text: '• 7 ngày đầu: Đổi trả miễn phí<br/>• Lỗi nhà sản xuất: Đổi mới 100%<br/>• Đổi ý: Hoàn 90% giá trị'
          },
          {
            title: '📝 Điều kiện',
            text: '• Còn nguyên hộp, phụ kiện<br/>• Chưa qua sử dụng<br/>• Có hóa đơn mua hàng'
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
            text: '• Điện thoại: 12 tháng<br/>• Pin, sạc: 6 tháng<br/>• Phụ kiện: 3 tháng<br/>• Bảo hành tại nhà sản xuất'
          },
          {
            title: '🔧 Dịch vụ bảo hành',
            text: '• Miễn phí vệ sinh máy<br/>• Kiểm tra định kỳ<br/>• Hỗ trợ kỹ thuật 24/7<br/>• Bảo hành tận nơi (VIP)'
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
            text: '• Thanh toán tiền mặt khi nhận<br/>• Không mất phí COD<br/>• An toàn, tiện lợi'
          },
          {
            title: '💳 Thanh toán online',
            text: '• Ví điện tử: MoMo, ZaloPay, VNPay<br/>• Thẻ tín dụng/ghi nợ<br/>• Chuyển khoản ngân hàng<br/>• Giảm thêm 2% khi thanh toán online'
          },
          {
            title: '🏦 Trả góp 0%',
            text: '• Trả góp qua thẻ tín dụng<br/>• Lãi suất 0%<br/>• Thời gian: 6-12 tháng<br/>• Duyệt nhanh trong 15 phút'
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

    const headerParts = [`${policy.icon} **${policy.title}**`];
    headerParts.push('\n👇 Nhấn để xem chi tiết:');
    const headerText = headerParts.join('\n');

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

    const headerParts = ['📞 **LIÊN HỆ HỖ TRỢ**'];
    headerParts.push('\n\n🎧 Chúng tôi luôn sẵn sàng hỗ trợ bạn!');
    const headerText = headerParts.join('\n');

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
                text: '• Hỗ trợ 24/7<br/>• Miễn phí cuộc gọi<br/>• Tư vấn viên chuyên nghiệp'
              }],
              [{
                type: 'accordion',
                title: '💬 Chat trực tuyến',
                subtitle: 'Phản hồi trong 1 phút',
                text: '• Phản hồi trong 1 phút<br/>• Hỗ trợ qua Facebook, Zalo<br/>• Chat ngay trên website'
              }],
              [{
                type: 'accordion',
                title: '📧 Email - support@smartbuy.vn',
                subtitle: 'Phản hồi trong 24h',
                text: '• Phản hồi trong 24h<br/>• Gửi khiếu nại, góp ý<br/>• Hỗ trợ kỹ thuật'
              }],
              [{
                type: 'accordion',
                title: '🏢 Địa chỉ showroom',
                subtitle: 'Mở cửa: 8h - 22h (Hằng ngày)',
                text: '• 123 Đường ABC, Quận 1, TP.HCM<br/>• 456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội<br/>• Mở cửa: 8h - 22h (Hằng ngày)'
              }],
              [{ type: 'divider' }],
              [{ type: 'chips', options: [
                { text: '📞 Gọi ngay 1900-xxxx' },
                { text: '💬 Chat Facebook',
                  link: 'https://www.facebook.com/nguyen.van.phap.648220'
                },
                { text: '💬 Chat Zalo' },
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
