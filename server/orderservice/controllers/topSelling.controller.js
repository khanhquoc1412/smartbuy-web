const Order = require('../models/Order');

/**
 * GET /api/order/stats/top-selling-products
 * Trả về danh sách sản phẩm bán chạy nhất (dựa trên số lượng đã bán thực tế)
 */
exports.getTopSellingProducts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        // Aggregate để tính tổng số lượng bán từ orders
        const topProducts = await Order.aggregate([
            // Chỉ lấy orders đã hoàn thành
            {
                $match: {
                    status: { $in: ['delivered', 'completed'] }
                }
            },
            // Unwind orderItems để tính từng sản phẩm
            { $unwind: '$orderItems' },
            // Group theo variant ID (nếu có), fallback về product ID
            {
                $group: {
                    _id: {
                        $ifNull: ['$orderItems.variant.variantId', '$orderItems.product']
                    },
                    productName: { $first: '$orderItems.name' },
                    totalSold: { $sum: '$orderItems.qty' },
                    totalRevenue: {
                        $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] }
                    },
                    productImage: { $first: '$orderItems.image' },
                    avgPrice: { $avg: '$orderItems.price' }
                }
            },
            // Sort theo số lượng bán giảm dần
            { $sort: { totalSold: -1 } },
            // Limit kết quả
            { $limit: parseInt(limit) },
            {
                $project: {
                    _id: 1,
                    productId: '$_id',
                    name: '$productName',
                    image: '$productImage',
                    sold: '$totalSold',
                    revenue: { $round: '$totalRevenue' },
                    avgPrice: { $round: '$avgPrice' }
                }
            }
        ]);

        // Lấy thông tin đầy đủ từ product-manager-service và review-service
        const axios = require('axios');
        const productServiceUrl = process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002';
        const reviewServiceUrl = process.env.REVIEW_SERVICE_URL || 'http://localhost:5006';

        // Enrich với thông tin đầy đủ từ product-manager-service và review-service
        const enrichedProducts = await Promise.all(
            topProducts.map(async (product) => {
                try {
                    // Bước 1: Lấy thông tin variant để có stock VÀ product ID
                    const variantResponse = await axios.get(
                        `${productServiceUrl}/api/products/variants/${product.productId}`
                    );

                    if (variantResponse.data.success && variantResponse.data.data) {
                        const variantData = variantResponse.data.data;

                        // Bước 2: Lấy Product ID từ variant (productId là object nên cần lấy _id)
                        const actualProductId = variantData.productId?._id || variantData.productId || variantData.product;

                        if (actualProductId) {
                            // Bước 3: Lấy thông tin product đầy đủ (basePrice, discountPercentage, slug)
                            const productResponse = await axios.get(
                                `${productServiceUrl}/api/products/${actualProductId}`
                            );

                            // Bước 4: Lấy rating từ review-service
                            let averageRating = 0;
                            let totalReviews = 0;
                            try {
                                const reviewResponse = await axios.get(
                                    `${reviewServiceUrl}/api/reviews/product/${actualProductId}?limit=1`
                                );
                                if (reviewResponse.data.success && reviewResponse.data.data.stats) {
                                    averageRating = reviewResponse.data.data.stats.averageRating || 0;
                                    totalReviews = reviewResponse.data.data.stats.totalReviews || 0;
                                }
                            } catch (reviewError) {
                                console.error(`Error fetching reviews for product ${actualProductId}:`, reviewError.message);
                            }

                            if (productResponse.data.success && productResponse.data.item) {
                                const productData = productResponse.data.item;

                                return {
                                    ...product,
                                    id: product.productId, // Giữ variant ID làm id
                                    basePrice: productData.basePrice || 0,
                                    discountPercentage: productData.discountPercentage || 0,
                                    slug: productData.slug || '',
                                    thumbUrl: product.image || productData.thumbUrl,
                                    stock: variantData.stock || 0,
                                    averageRating: Math.round(averageRating * 10) / 10, // Làm tròn 1 chữ số
                                    totalReviews: totalReviews
                                };
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching details for variant ${product.productId}:`, error.message);
                }

                // Fallback nếu không lấy được
                return {
                    ...product,
                    id: product.productId,
                    basePrice: 0,
                    discountPercentage: 0,
                    slug: '',
                    thumbUrl: product.image,
                    stock: 0,
                    averageRating: 0,
                    totalReviews: 0
                };
            })
        );

        res.json({
            success: true,
            data: enrichedProducts
        });
    } catch (error) {
        console.error('Error in getTopSellingProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thống kê bán hàng',
            error: error.message
        });
    }
};

/**
 * GET /api/order/stats/product-sold/:productId
 * Trả về tổng số lượng đã bán của một sản phẩm cụ thể
 */
exports.getProductSoldCount = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log('🔍 getProductSoldCount called with productId:', productId);

        // Aggregate để tính tổng số lượng bán của sản phẩm (bao gồm tất cả variants)
        const soldStats = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['completed', 'delivered'] }
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                $match: {
                    $expr: {
                        $eq: [{ $toString: '$orderItems.product' }, productId]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSold: { $sum: '$orderItems.qty' }
                }
            }
        ]);

        const totalSold = soldStats.length > 0 ? soldStats[0].totalSold : 0;

        res.json({
            success: true,
            data: {
                productId,
                totalSold
            }
        });
    } catch (error) {
        console.error('Error in getProductSoldCount:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy số lượng bán',
            error: error.message
        });
    }
};
