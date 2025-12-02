const Order = require("../models/Order");

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
          status: { $in: ["delivered", "completed"] },
        },
      },
      // Unwind orderItems để tính từng sản phẩm
      { $unwind: "$orderItems" },
      // Group theo variant ID (nếu có), fallback về product ID
      {
        $group: {
          _id: {
            $ifNull: ["$orderItems.variant.variantId", "$orderItems.product"],
          },
          productId: { $first: "$orderItems.product" },
          productName: { $first: "$orderItems.name" },
          totalSold: { $sum: "$orderItems.qty" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] },
          },
          productImage: { $first: "$orderItems.image" },
          avgPrice: { $avg: "$orderItems.price" },
        },
      },
      // Sort theo số lượng bán giảm dần
      { $sort: { totalSold: -1 } },
      // Limit kết quả
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          variantId: "$_id",
          productId: "$productId",
          name: "$productName",
          image: "$productImage",
          sold: "$totalSold",
          revenue: { $round: "$totalRevenue" },
          avgPrice: { $round: "$avgPrice" },
        },
      },
    ]);

    // Lấy thông tin đầy đủ từ productservice và review-service
    const axios = require("axios");
    const productServiceUrl =
      process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
    const reviewServiceUrl =
      process.env.REVIEW_SERVICE_URL || "http://localhost:5006";

    console.log(
      `🔍 Fetching details for ${topProducts.length} products from:`,
      {
        productService: productServiceUrl,
        reviewService: reviewServiceUrl,
      }
    );

    if (topProducts.length === 0) {
      console.log("⚠️  No top selling products found in orders");
      return res.json({
        success: true,
        data: [],
      });
    }

    // Enrich với thông tin đầy đủ từ productservice và review-service
    const enrichedProducts = await Promise.all(
      topProducts.map(async (product) => {
        try {
          const variantId = String(product.variantId || "");
          const productId = String(product.productId || "");
          console.log(
            `📦 Processing variant: ${variantId}, product: ${productId}`
          );

          // Bước 1: Lấy thông tin variant từ productservice
          const variantResponse = await axios.get(
            `${productServiceUrl}/api/product/variant/${variantId}`,
            { timeout: 5000 }
          );

          if (variantResponse.data.success && variantResponse.data.data) {
            const variantData = variantResponse.data.data;
            console.log(`✅ Got variant data for ${variantId}:`, {
              stock: variantData.stock,
              productId: variantData.productId,
            });

            // Bước 2: Lấy Product ID từ variant
            const actualProductId = String(variantData.productId || productId);

            if (actualProductId) {
              // Bước 3: Lấy thông tin product đầy đủ từ productservice
              const productResponse = await axios.get(
                `${productServiceUrl}/api/product/id/${actualProductId}`,
                { timeout: 5000 }
              );

              console.log(`🔍 Product API response for ${actualProductId}:`, {
                success: productResponse.data.success,
                hasData: !!productResponse.data.data,
                slug: productResponse.data.data?.slug,
              });

              // Bước 4: Lấy rating từ review-service
              let averageRating = 0;
              let totalReviews = 0;
              try {
                const reviewResponse = await axios.get(
                  `${reviewServiceUrl}/api/reviews/product/${actualProductId}?limit=1`,
                  { timeout: 3000 }
                );
                if (
                  reviewResponse.data.success &&
                  reviewResponse.data.data.stats
                ) {
                  averageRating =
                    reviewResponse.data.data.stats.averageRating || 0;
                  totalReviews =
                    reviewResponse.data.data.stats.totalReviews || 0;
                }
              } catch (reviewError) {
                console.error(
                  `⚠️  Error fetching reviews for product ${actualProductId}:`,
                  reviewError.message
                );
              }

              if (productResponse.data.success && productResponse.data.data) {
                const productData = productResponse.data.data;

                console.log(`📝 Product data for ${actualProductId}:`, {
                  name: productData.name,
                  slug: productData.slug,
                  basePrice: productData.basePrice,
                  discountPercentage: productData.discountPercentage,
                });

                return {
                  ...product,
                  id: variantId, // Giữ variant ID làm id
                  basePrice: productData.basePrice || 0,
                  discountPercentage: productData.discountPercentage || 0,
                  slug: productData.slug || "",
                  thumbUrl: product.image || productData.thumbUrl,
                  stock: variantData.stock || 0,
                  averageRating: Math.round(averageRating * 10) / 10,
                  totalReviews: totalReviews,
                };
              } else {
                console.error(
                  `❌ Invalid product response for ${actualProductId}:`,
                  productResponse.data
                );
              }
            }
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message;
          const statusCode = error.response?.status || "Unknown";
          console.error(
            `❌ Error fetching details for variant ${product.variantId}: [${statusCode}] ${errorMsg}`
          );
        }

        // Fallback nếu không lấy được
        console.warn(`⚠️  Using fallback for variant ${product.variantId}`);

        // Generate slug from product name as fallback
        const slugFromName = product.name
          ? product.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
          : "";

        return {
          ...product,
          id: product.variantId || product.productId,
          basePrice: 0,
          discountPercentage: 0,
          slug: slugFromName,
          thumbUrl: product.image,
          stock: 0,
          averageRating: 0,
          totalReviews: 0,
        };
      })
    );

    console.log(`✅ Successfully enriched ${enrichedProducts.length} products`);
    console.log("📊 Sample enriched product:", enrichedProducts[0]);

    res.json({
      success: true,
      data: enrichedProducts,
    });
  } catch (error) {
    console.error("Error in getTopSellingProducts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê bán hàng",
      error: error.message,
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
    console.log("🔍 getProductSoldCount called with productId:", productId);

    // Aggregate để tính tổng số lượng bán của sản phẩm (bao gồm tất cả variants)
    const soldStats = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "delivered"] },
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $match: {
          $expr: {
            $eq: [{ $toString: "$orderItems.product" }, productId],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$orderItems.qty" },
        },
      },
    ]);

    const totalSold = soldStats.length > 0 ? soldStats[0].totalSold : 0;

    res.json({
      success: true,
      data: {
        productId,
        totalSold,
      },
    });
  } catch (error) {
    console.error("Error in getProductSoldCount:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy số lượng bán",
      error: error.message,
    });
  }
};
