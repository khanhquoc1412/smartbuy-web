const Review = require("../models/review");

// Tạo review mới
exports.createReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment, userName, isVerifiedPurchase, images } = req.body;

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
      rating,
      comment,
      userName,
      isVerifiedPurchase: isVerifiedPurchase || false,
      images: images || [],
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Tạo đánh giá thành công",
      data: review,
    });
  } catch (error) {
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
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
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

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulCount: 1 } },
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
      message: "Đã đánh dấu hữu ích",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh dấu hữu ích",
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
