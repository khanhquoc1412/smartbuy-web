const Review = require("../models/review");

// Tạo review mới
exports.createReview = async (req, res) => {
  try {
    const { userId, productId, productName, rating, comment, userName, images } = req.body;

    // Validate required fields
    if (!userId || !productId || !productName || !rating || !comment || !userName) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá phải từ 1 đến 5 sao",
      });
    }

    // Validate comment length
    if (comment.trim().length < 15) {
      return res.status(400).json({
        success: false,
        message: "Nội dung đánh giá phải có tối thiểu 15 ký tự",
      });
    }

    // Kiểm tra user đã review sản phẩm này chưa
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    const review = new Review({
      userId,
      productId,
      productName,
      rating,
      comment: comment.trim(),
      userName,
      images: images || [],
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Tạo đánh giá thành công",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đánh giá",
      error: error.message,
    });
  }
};

// Lấy tất cả reviews của một sản phẩm
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = "createdAt" } = req.query;

    const query = { productId, isVisible: true };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(query)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    // Tính thống kê rating
    const stats = await Review.aggregate([
      { $match: { productId: productId, isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
        stats: stats[0] || {
          averageRating: 0,
          totalReviews: 0,
          rating5: 0,
          rating4: 0,
          rating3: 0,
          rating2: 0,
          rating1: 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy đánh giá",
      error: error.message,
    });
  }
};

// Lấy tất cả reviews (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, isVisible, sortBy = "createdAt", search } = req.query;

    const query = {};
    if (rating) {
      query.rating = parseInt(rating);
    }
    if (isVisible !== undefined) {
      query.isVisible = isVisible === 'true';
    }
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(query)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đánh giá",
      error: error.message,
    });
  }
};

// Lấy reviews của một user
exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy đánh giá của user",
      error: error.message,
    });
  }
};

// Lấy chi tiết một review
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy đánh giá",
      error: error.message,
    });
  }
};

// Cập nhật review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    res.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật đánh giá",
      error: error.message,
    });
  }
};

// Xóa review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đánh giá",
      error: error.message,
    });
  }
};

// Đánh dấu review hữu ích
exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    // Check if user already marked as helpful
    const hasMarked = review.helpfulBy.includes(userId);

    if (hasMarked) {
      // Remove userId from helpfulBy array and decrease count
      review.helpfulBy = review.helpfulBy.filter(id => id !== userId);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add userId to helpfulBy array and increase count
      review.helpfulBy.push(userId);
      review.helpfulCount = review.helpfulCount + 1;
    }

    await review.save();

    res.json({
      success: true,
      message: hasMarked ? "Đã bỏ đánh dấu hữu ích" : "Đã đánh dấu hữu ích",
      data: {
        review,
        hasMarked: !hasMarked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh dấu hữu ích",
      error: error.message,
    });
  }
};

// Admin phản hồi đánh giá
exports.replyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply, adminId } = req.body;

    if (!adminReply || !adminReply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nội dung phản hồi không được để trống",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    review.adminReply = adminReply.trim();
    review.adminReplyBy = adminId || "admin";
    review.adminReplyAt = new Date();

    await review.save();

    res.json({
      success: true,
      message: "Phản hồi đánh giá thành công",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi phản hồi đánh giá",
      error: error.message,
    });
  }
};

// Ẩn/hiện review (admin)
exports.toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible, hiddenReason, adminId } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible phải là boolean",
      });
    }

    const updateData = { isVisible };
    
    if (!isVisible) {
      // Khi ẩn đánh giá
      updateData.hiddenReason = hiddenReason || "Vi phạm chính sách";
      updateData.hiddenBy = adminId;
      updateData.hiddenAt = new Date();
    } else {
      // Khi hiện lại đánh giá
      updateData.hiddenReason = null;
      updateData.hiddenBy = null;
      updateData.hiddenAt = null;
    }

    const review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      message: isVisible ? "Đã hiện đánh giá" : "Đã ẩn đánh giá",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật hiển thị",
      error: error.message,
    });
  }
};

// Lấy thống kê tổng quan
exports.getStats = async (req, res) => {
  try {
    // Tổng số reviews (tất cả)
    const totalReviews = await Review.countDocuments();
    
    // Thống kê reviews visible
    const stats = await Review.aggregate([
      { $match: { isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalHelpful: { $sum: "$helpfulCount" },
        },
      },
    ]);

    const visibilityStats = await Review.aggregate([
      {
        $group: {
          _id: "$isVisible",
          count: { $sum: 1 },
        },
      },
    ]);

    // Transform visibility stats to {visible, hidden} format
    const visibilityObj = visibilityStats.reduce((acc, item) => {
      if (item._id === true) {
        acc.visible = item.count;
      } else {
        acc.hidden = item.count;
      }
      return acc;
    }, { visible: 0, hidden: 0 });

    res.json({
      success: true,
      data: {
        overall: {
          totalReviews: totalReviews,
          averageRating: stats[0]?.averageRating || 0,
          totalHelpful: stats[0]?.totalHelpful || 0
        },
        byVisibility: visibilityObj,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê",
      error: error.message,
    });
  }
};

// Lấy phân bố rating
exports.getRatingDistribution = async (req, res) => {
  try {
    const distribution = await Review.aggregate([
      { $match: { isVisible: true } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Transform to array with all ratings 1-5
    const result = [5, 4, 3, 2, 1].map(rating => {
      const found = distribution.find(d => d._id === rating);
      return {
        rating,
        count: found ? found.count : 0,
      };
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy phân bố rating",
      error: error.message,
    });
  }
};

// Lấy top sản phẩm được đánh giá nhiều nhất
exports.getTopReviewedProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Review.aggregate([
      { $match: { isVisible: true } },
      {
        $group: {
          _id: "$productId",
          productName: { $first: "$productName" },
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { totalReviews: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy top sản phẩm được đánh giá",
      error: error.message,
    });
  }
};

// Lấy xu hướng đánh giá theo thời gian
exports.getReviewTrends = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isVisible: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy xu hướng đánh giá",
      error: error.message,
    });
  }
};

// Lấy thống kê reviews có/không có hình ảnh
exports.getImageStats = async (req, res) => {
  try {
    const withImages = await Review.countDocuments({
      isVisible: true,
      images: { $exists: true, $not: { $size: 0 } },
    });

    const withoutImages = await Review.countDocuments({
      isVisible: true,
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
      ],
    });

    res.json({
      success: true,
      data: {
        withImages,
        withoutImages,
        total: withImages + withoutImages,
        percentage: {
          withImages: withImages > 0 ? ((withImages / (withImages + withoutImages)) * 100).toFixed(1) : 0,
          withoutImages: withoutImages > 0 ? ((withoutImages / (withImages + withoutImages)) * 100).toFixed(1) : 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê hình ảnh",
      error: error.message,
    });
  }
};
