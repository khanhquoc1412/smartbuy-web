const User = require("../models/User");
const mongoose = require("mongoose");

// Tạo connection đến order database
const orderDbUri =
  process.env.ORDER_DB_URI ||
  process.env.DB_PROD_URL ||
  (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('smartbuy_db')
    ? process.env.MONGODB_URI.replace('smartbuy_db', 'smartbuy_db_order')
    : "mongodb://localhost:27017/smartbuy_db_order");

console.log(`📡 Connecting to Order DB at: ${orderDbUri.replace(/:([^:@]+)@/, ':****@')}`);
const orderConnection = mongoose.createConnection(orderDbUri);

orderConnection.on('connected', () => {
  console.log('✅ Connected to Order Database from User Manager Stats');
});

orderConnection.on('error', (err) => {
  console.error('❌ Order Database Connection Error in Stats Controller:', err.message);
});

// Define Order schema inline (giống với order-manager-service)
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        qty: Number,
        price: Number,
        image: String,
        variant: {
          color: String,
          memory: String,
          variantId: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending_payment",
        "payment_failed",
        "pending",
        "confirmed",
        "processing",
        "ready_to_ship",
        "shipping",
        "delivered",
        "completed",
        "cancelled",
        "returned",
      ],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Order = orderConnection.model("Order", orderSchema);

/**
 * GET /api/users/stats/overview
 * Lấy tổng quan khách hàng
 */
exports.getUsersOverview = async (req, res) => {
  try {
    const { dateRange = "30days", startDate, endDate } = req.query;

    const totalUsers = await User.countDocuments({ isAdmin: false });
    const verifiedUsers = await User.countDocuments({
      isVerified: true,
      isAdmin: false,
    });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // Lấy số lượng user mới trong khoảng thời gian
    let dateFilter = {};
    if (dateRange && dateRange !== "custom") {
      const now = new Date();
      let daysAgo;
      switch (dateRange) {
        case "7days":
          daysAgo = 7;
          break;
        case "30days":
          daysAgo = 30;
          break;
        case "90days":
          daysAgo = 90;
          break;
        case "year":
          daysAgo = 365;
          break;
        default:
          daysAgo = 30;
      }
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: startDate } };
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const newUsers = await User.countDocuments({
      ...dateFilter,
      isAdmin: false,
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        blockedUsers,
        adminUsers,
        newUsers,
        verificationRate:
          totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    console.error("Error in getUsersOverview:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

/**
 * GET /api/users/stats/segments
 * Phân khúc khách hàng: VIP, Thường xuyên, Mới
 * Tích hợp với dữ liệu thật từ Order collection
 */
exports.getCustomerSegments = async (req, res) => {
  try {
    const { segment, page = 1, limit = 10 } = req.query;

    // Tính tổng chi tiêu và số đơn hàng của từng user
    const customerStats = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "delivered"] }, // Chỉ tính đơn hoàn thành
        },
      },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    // Phân loại khách hàng
    const VIP_THRESHOLD = 50000000; // 50 triệu
    const FREQUENT_ORDER_COUNT = 5; // 5 đơn hàng
    const NEW_CUSTOMER_DAYS = 30; // 30 ngày

    const now = new Date();
    const newCustomerDate = new Date(
      now.getTime() - NEW_CUSTOMER_DAYS * 24 * 60 * 60 * 1000
    );

    const vipCustomers = [];
    const frequentCustomers = [];
    const newCustomers = [];

    customerStats.forEach((customer) => {
      if (customer.totalSpent >= VIP_THRESHOLD) {
        vipCustomers.push(customer._id);
      } else if (customer.orderCount >= FREQUENT_ORDER_COUNT) {
        // FIXED: Chỉ tính là "Thường xuyên" nếu KHÔNG phải VIP
        frequentCustomers.push(customer._id);
      } else {
        newCustomers.push(customer._id);
      }
    });

    // Nếu có query segment cụ thể, trả về danh sách khách hàng với phân trang
    if (segment) {
      let customerIds = [];
      let segmentStats = [];

      if (segment === "vip") {
        customerIds = vipCustomers;
        segmentStats = customerStats.filter((stat) =>
          vipCustomers.some((id) => id.toString() === stat._id.toString())
        );
        // VIP: Sắp xếp theo totalSpent giảm dần (người chi nhiều nhất lên đầu)
        segmentStats.sort((a, b) => b.totalSpent - a.totalSpent);
      } else if (segment === "frequent") {
        customerIds = frequentCustomers;
        segmentStats = customerStats.filter((stat) =>
          frequentCustomers.some((id) => id.toString() === stat._id.toString())
        );
        // Thường xuyên: Sắp xếp theo orderCount giảm dần
        segmentStats.sort((a, b) => b.orderCount - a.orderCount);
      } else if (segment === "new") {
        customerIds = newCustomers;
        segmentStats = customerStats.filter((stat) =>
          newCustomers.some((id) => id.toString() === stat._id.toString())
        );
        // Mới: Sắp xếp theo lastOrderDate giảm dần (mới nhất lên đầu)
        segmentStats.sort(
          (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
        );
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedStats = segmentStats.slice(skip, skip + parseInt(limit));
      const paginatedIds = paginatedStats.map((stat) => stat._id);

      // Lấy thông tin chi tiết user
      const users = await User.find({ _id: { $in: paginatedIds } })
        .select("userName email avatarUrl createdAt")
        .lean();

      // Map với stats và giữ thứ tự đã sắp xếp
      const customerDetails = paginatedStats.map((stat, index) => {
        const user =
          users.find((u) => u._id.toString() === stat._id.toString()) || {};

        return {
          userId: stat._id,
          name: user.userName || "Khách hàng",
          email: user.email || "",
          avatar: user.avatarUrl || "",
          totalOrders: stat.orderCount || 0,
          totalSpent: stat.totalSpent || 0,
          lastOrderDate: stat.lastOrderDate,
          memberSince: user.createdAt,
          ranking: skip + index + 1, // Thêm số thứ hạng (bắt đầu từ 1)
        };
      });

      return res.json({
        success: true,
        data: {
          customers: customerDetails,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: customerIds.length,
            totalPages: Math.ceil(customerIds.length / parseInt(limit)),
          },
        },
      });
    }

    // Không có segment query, trả về tổng số của từng phân khúc
    res.json({
      success: true,
      data: [
        {
          segment: "VIP",
          count: vipCustomers.length,
          description: "Chi tiêu ≥ 50 triệu",
        },
        {
          segment: "Thường xuyên",
          count: frequentCustomers.length,
          description: "Đã mua ≥ 5 đơn",
        },
        {
          segment: "Mới",
          count: newCustomers.length,
          description: "Khách hàng mới hoặc ít đơn",
        },
      ],
    });
  } catch (error) {
    console.error("Error in getCustomerSegments:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

/**
 * GET /api/users/stats/top-customers
 * Lấy top khách hàng VIP dựa trên tổng chi tiêu thực tế
 */
exports.getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Aggregate để tính tổng chi tiêu và số đơn của từng user
    const topCustomerStats = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "delivered"] }, // Chỉ tính đơn hoàn thành
        },
      },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" },
          firstOrderDate: { $min: "$createdAt" },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    // Lấy thông tin chi tiết của user từ User collection
    const userIds = topCustomerStats.map((stat) => stat._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select("userName email avatarUrl")
      .lean();

    // Map user info với stats
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const topCustomers = topCustomerStats.map((stat) => {
      const user = userMap[stat._id.toString()] || {};
      return {
        userId: stat._id,
        name: user.userName || "Khách hàng",
        email: user.email || "",
        avatar: user.avatarUrl || "",
        totalOrders: stat.totalOrders,
        totalSpent: stat.totalSpent,
        orders: stat.totalOrders, // Thêm field này cho frontend
        memberSince: stat.firstOrderDate,
        lastOrder: stat.lastOrderDate,
      };
    });

    res.json({
      success: true,
      data: topCustomers,
    });
  } catch (error) {
    console.error("Error in getTopCustomers:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

/**
 * GET /api/users/stats/activity
 * Thống kê hoạt động người dùng theo thời gian
 */
exports.getUserActivity = async (req, res) => {
  try {
    const { dateRange = "30days", groupBy = "day" } = req.query;

    let daysAgo = 30;
    switch (dateRange) {
      case "7days":
        daysAgo = 7;
        break;
      case "30days":
        daysAgo = 30;
        break;
      case "90days":
        daysAgo = 90;
        break;
      case "year":
        daysAgo = 365;
        break;
    }

    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    let groupFormat;
    if (groupBy === "day") {
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    } else if (groupBy === "week") {
      groupFormat = { $week: "$createdAt" };
    } else {
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }

    const activity = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isAdmin: false,
        },
      },
      {
        $group: {
          _id: groupFormat,
          newUsers: { $sum: 1 },
          verifiedUsers: {
            $sum: { $cond: ["$isVerified", 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      data: activity.map((item) => ({
        date: item._id,
        newUsers: item.newUsers,
        verifiedUsers: item.verifiedUsers,
      })),
    });
  } catch (error) {
    console.error("Error in getUserActivity:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
