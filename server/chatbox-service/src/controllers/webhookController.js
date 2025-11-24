const intentHandlers = require('./intentHandlers');

/**
 * Main Dialogflow Webhook Handler
 * Receives requests from Dialogflow and routes to appropriate intent handler
 */
exports.handleDialogflowWebhook = async (req, res) => {
  try {
    console.log('🤖 Dialogflow Webhook Request Received');
    
    // Extract Dialogflow request data
    const { queryResult, session } = req.body;
    const intentName = queryResult?.intent?.displayName;
    const parameters = queryResult?.parameters || {};
    const queryText = queryResult?.queryText;
    const languageCode = queryResult?.languageCode || 'vi';

    console.log(`📝 Intent: ${intentName}`);
    console.log(`💬 Query: ${queryText}`);
    console.log(`📊 Parameters:`, JSON.stringify(parameters, null, 2));

    // Route to appropriate intent handler
    let fulfillmentResponse;

    switch (intentName) {
      // ==================== PRODUCT INTENTS ====================
      case 'product.search':
        fulfillmentResponse = await intentHandlers.handleProductSearch(parameters, queryResult);
        break;

      case 'product.search.by-brand':
        fulfillmentResponse = await intentHandlers.handleProductSearchByBrand(parameters, queryResult);
        break;

      case 'product.search.by-price':
        fulfillmentResponse = await intentHandlers.handleProductSearchByPrice(parameters, queryResult);
        break;

      case 'product.detail':
        fulfillmentResponse = await intentHandlers.handleProductDetail(parameters, queryResult);
        break;

      case 'product.search.by-color':
        fulfillmentResponse = await intentHandlers.handleProductSearchByColor(parameters, queryResult);
        break;

      case 'product.search.by-memory':
        fulfillmentResponse = await intentHandlers.handleProductSearchByMemory(parameters, queryResult);
        break;

      // ==================== ORDER INTENTS ====================
      case 'order.track':
        fulfillmentResponse = await intentHandlers.handleOrderTrack(parameters, queryResult, session);
        break;

      case 'order.cancel':
        fulfillmentResponse = await intentHandlers.handleOrderCancel(parameters, queryResult, session);
        break;

      // ==================== PROMOTION INTENTS ====================
      case 'promotion.check':
        fulfillmentResponse = await intentHandlers.handlePromotionCheck(parameters, queryResult);
        break;

      // ==================== COMPARISON INTENTS ====================
      case 'price.compare':
      case 'product.compare':
        fulfillmentResponse = await intentHandlers.handlePriceCompare(parameters, queryResult);
        break;

      // ==================== POLICY INTENTS ====================
      case 'policy.shipping':
      case 'policy.return':
      case 'policy.warranty':
      case 'policy.payment':
        fulfillmentResponse = await intentHandlers.handlePolicyQuestions(intentName, parameters, queryResult);
        break;

      // ==================== SUPPORT INTENTS ====================
      case 'contact.support':
        fulfillmentResponse = await intentHandlers.handleContactSupport(parameters, queryResult);
        break;

      // ==================== DEFAULT FALLBACK ====================
      // default:
      //   console.log(`⚠️ Unhandled Intent: ${intentName}`);
      //   fulfillmentResponse = {
      //     fulfillmentText: 'Xin lỗi, tôi chưa được huấn luyện để xử lý yêu cầu này. Bạn có thể hỏi về sản phẩm, đơn hàng hoặc chính sách của chúng tôi.',
      //     fulfillmentMessages: [
      //       {
      //         text: {
      //           text: ['Tôi có thể giúp bạn:\n- Tìm kiếm sản phẩm\n- Kiểm tra đơn hàng\n- Xem khuyến mãi\n- Chính sách đổi trả/bảo hành']
      //         }
      //       }
      //     ]
      //   };
    }

    // Add suggestion chips to all responses
    if (process.env.ENABLE_SUGGESTION_CHIPS === 'true') {
      fulfillmentResponse = addSuggestionChips(fulfillmentResponse, intentName);
    }

    // Log response
    console.log('✅ Response prepared for Dialogflow');

    // Send response back to Dialogflow
    res.json(fulfillmentResponse);

  } catch (error) {
    console.error('❌ Webhook Error:', error);
    
    // Send error response to Dialogflow
    res.json({
      fulfillmentText: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
      fulfillmentMessages: [
        {
          text: {
            text: ['Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau hoặc liên hệ hotline 1900-xxxx']
          }
        }
      ]
    });
  }
};

/**
 * Add suggestion chips to response
 * @param {Object} response - Fulfillment response
 * @param {String} currentIntent - Current intent name
 * @returns {Object} Response with suggestion chips
 */
function addSuggestionChips(response, currentIntent) {
  const suggestions = {
    'product.search': ['Xem khuyến mãi', 'Kiểm tra đơn hàng', 'Chính sách đổi trả'],
    'product.search.by-brand': ['So sánh giá', 'Xem chi tiết', 'Thêm vào giỏ'],
    'order.track': ['Hủy đơn hàng', 'Xem sản phẩm khác', 'Liên hệ hỗ trợ'],
    'default': ['Tìm sản phẩm', 'Kiểm tra đơn hàng', 'Xem khuyến mãi']
  };

  const chips = suggestions[currentIntent] || suggestions['default'];

  if (!response.fulfillmentMessages) {
    response.fulfillmentMessages = [];
  }

  response.fulfillmentMessages.push({
    payload: {
      richContent: [
        [
          {
            type: 'chips',
            options: chips.map(text => ({ text }))
          }
        ]
      ]
    }
  });

  return response;
}
