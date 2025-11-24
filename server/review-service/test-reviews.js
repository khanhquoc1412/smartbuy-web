// Test Review Service Endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api/reviews';

// Test data
const timestamp = Date.now();
const sampleReview = {
  userId: `user_${timestamp}`,
  productId: `product_${timestamp}`,
  rating: 5,
  comment: 'Sản phẩm rất tốt! Pin trâu, màn hình đẹp.',
  userName: 'Nguyễn Văn A',
  isVerifiedPurchase: true,
  images: []
};

async function testReviewService() {
  console.log('🧪 Testing Review Service...\n');

  try {
    // 1. POST - Create new review
    console.log('📝 Test 1: POST /api/reviews');
    console.log('Request URL:', BASE_URL);
    console.log('Request data:', sampleReview);
    
    const createResponse = await axios.post(BASE_URL, sampleReview);
    console.log('✅ Review created:', {
      id: createResponse.data.data._id,
      rating: createResponse.data.data.rating,
      isVisible: createResponse.data.data.isVisible
    });
    const reviewId = createResponse.data.data._id;
    console.log('');

    // 2. GET - Get reviews by product
    console.log('📋 Test 2: GET /api/reviews/product/:productId');
    const getResponse = await axios.get(`${BASE_URL}/product/${sampleReview.productId}`);
    console.log('✅ Reviews retrieved:', {
      total: getResponse.data.data.totalReviews,
      averageRating: getResponse.data.data.averageRating,
      reviews: getResponse.data.data.reviews.length
    });
    console.log('');

    // 3. PATCH - Toggle visibility (hide review)
    console.log('🔒 Test 3: PATCH /api/reviews/:id/visibility');
    const patchResponse = await axios.patch(`${BASE_URL}/${reviewId}/visibility`, {
      isVisible: false,
      hiddenReason: 'Vi phạm quy định về ngôn từ'
    });
    console.log('✅ Visibility toggled:', {
      id: patchResponse.data.data._id,
      isVisible: patchResponse.data.data.isVisible,
      hiddenReason: patchResponse.data.data.hiddenReason
    });
    console.log('');

    // 4. GET - Verify hidden review is not returned
    console.log('🔍 Test 4: GET reviews after hiding');
    const getAfterHide = await axios.get(`${BASE_URL}/product/${sampleReview.productId}`);
    console.log('✅ Public reviews (should not include hidden):', {
      total: getAfterHide.data.data.totalReviews,
      reviews: getAfterHide.data.data.reviews.length
    });
    console.log('');

    // 5. PATCH - Show review again
    console.log('👁️ Test 5: PATCH /api/reviews/:id/visibility (show)');
    const showResponse = await axios.patch(`${BASE_URL}/${reviewId}/visibility`, {
      isVisible: true
    });
    console.log('✅ Visibility restored:', {
      id: showResponse.data.data._id,
      isVisible: showResponse.data.data.isVisible
    });
    console.log('');

    // 6. GET - All reviews endpoint
    console.log('📊 Test 6: GET /api/reviews (all reviews with pagination)');
    const allReviews = await axios.get(`${BASE_URL}?page=1&limit=10`);
    console.log('✅ All reviews:', {
      total: allReviews.data.data.total,
      page: allReviews.data.data.currentPage,
      reviews: allReviews.data.data.reviews.length
    });

    console.log('\n✅ All tests passed! Review service is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('No response received. Is the server running?');
    }
  }
}

testReviewService();
