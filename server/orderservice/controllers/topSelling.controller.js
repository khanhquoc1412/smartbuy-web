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
            // Group theo productId
            {
                $group: {
                    _id: '$orderItems.product',
                    totalSold: { $sum: '$orderItems.qty' },
                    totalRevenue: {
                        $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] }
                    }
                }
            },
            // Sort theo số lượng bán giảm dần
            { $sort: { totalSold: -1 } },
            // Limit kết quả
            { $limit: parseInt(limit) }
        ]);

        res.json({
            success: true,
            data: topProducts.map(p => ({
                productId: p._id,
                sold: p.totalSold,
                revenue: Math.round(p.totalRevenue)
            }))
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
