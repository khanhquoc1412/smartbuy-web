const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const axios = require("axios");

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3004";

/**
 * GET /api/product/top-selling
 * Lấy sản phẩm bán chạy dựa trên số lượng đã bán thực tế từ orderservice
 */
const getTopSellingProducts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        // Bước 1: Gọi API orderservice
        let salesData = [];
        try {
            const { data } = await axios.get(
                `${ORDER_SERVICE_URL}/api/order/stats/top-selling-products`,
                { params: { limit } }
            );
            salesData = data.success ? data.data : [];
        } catch (error) {
            console.warn("Could not fetch sales data:", error.message);
        }

        // Fallback nếu không có dữ liệu bán hàng
        if (!salesData || salesData.length === 0) {
            const fallbackProducts = await Product.find()
                .populate("brand", "name")
                .populate("category", "name")
                .limit(parseInt(limit))
                .lean();

            return res.json({
                success: true,
                data: fallbackProducts.map(p => ({
                    id: p._id,
                    productId: p._id,
                    name: p.name,
                    image: p.thumbUrl,
                    thumbUrl: p.thumbUrl,
                    slug: p.slug,
                    brand: p.brand?.name,
                    category: p.category?.name,
                    basePrice: p.basePrice,
                    discountPercentage: p.discountPercentage,
                    sold: 0,
                    revenue: 0
                }))
            });
        }

        // Bước 2: Lấy thông tin sản phẩm
        const productIds = salesData.map(s => s.productId);
        const products = await Product.find({ _id: { $in: productIds } })
            .populate("brand", "name")
            .populate("category", "name")
            .lean();

        // Bước 3: Merge data
        const result = productIds.map(pid => {
            const salesInfo = salesData.find(s => s.productId.toString() === pid.toString());
            const product = products.find(p => p._id.toString() === pid.toString());

            if (!product) return null;

            return {
                id: product._id,
                productId: product._id,
                name: product.name,
                image: product.thumbUrl,
                brand: product.brand?.name || null,
                category: product.category?.name || null,
                slug: product.slug,
                basePrice: product.basePrice,
                discountPercentage: product.discountPercentage,
                thumbUrl: product.thumbUrl,
                sold: salesInfo?.sold || 0,
                revenue: salesInfo?.revenue || 0
            };
        }).filter(Boolean);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Error in getTopSellingProducts:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

module.exports = { getTopSellingProducts };
