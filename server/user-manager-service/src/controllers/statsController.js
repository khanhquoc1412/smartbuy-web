const User = require('../models/User');

/**
 * GET /api/users/stats/overview
 * Lấy tổng quan khách hàng
 */
exports.getUsersOverview = async (req, res) => {
  try {
    const { dateRange = '30days', startDate, endDate } = req.query;

    const totalUsers = await User.countDocuments({ isAdmin: false });
    const verifiedUsers = await User.countDocuments({ isVerified: true, isAdmin: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // Lấy số lượng user mới trong khoảng thời gian
    let dateFilter = {};
    if (dateRange && dateRange !== 'custom') {
      const now = new Date();
      let daysAgo;
      switch (dateRange) {
        case '7days': daysAgo = 7; break;
        case '30days': daysAgo = 30; break;
        case '90days': daysAgo = 90; break;
        case 'year': daysAgo = 365; break;
        default: daysAgo = 30;
      }
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: startDate } };
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const newUsers = await User.countDocuments({ ...dateFilter, isAdmin: false });

    res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        blockedUsers,
        adminUsers,
        newUsers,
        verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Error in getUsersOverview:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/users/stats/segments
 * Phân khúc khách hàng: VIP, Thường xuyên, Mới
 * Note: Cần data từ Order Service để phân loại chính xác
 */
exports.getCustomerSegments = async (req, res) => {
  try {
    // TODO: Cần call Order Service để lấy thông tin đơn hàng của từng user
    // Tạm thời mock data dựa trên số lượng user
    const totalUsers = await User.countDocuments({ isAdmin: false });
    
    // Mock segments (sẽ được thay bằng logic thực từ Order data)
    const segments = {
      vip: Math.round(totalUsers * 0.15),        // 15% VIP
      frequent: Math.round(totalUsers * 0.35),   // 35% Thường xuyên
      new: Math.round(totalUsers * 0.50)         // 50% Mới
    };

    res.json({
      success: true,
      data: [
        { segment: 'VIP', count: segments.vip, description: 'Khách hàng có giá trị cao' },
        { segment: 'Thường xuyên', count: segments.frequent, description: 'Mua hàng thường xuyên' },
        { segment: 'Mới', count: segments.new, description: 'Khách hàng mới' }
      ]
    });
  } catch (error) {
    console.error('Error in getCustomerSegments:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/users/stats/top-customers
 * Lấy top khách hàng VIP
 * Note: Cần data từ Order Service để tính tổng chi tiêu
 */
exports.getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // TODO: Call Order Service để lấy top customers theo tổng chi tiêu
    // Tạm thời lấy random verified users
    const topUsers = await User.find({ 
      isAdmin: false, 
      isVerified: true,
      isBlocked: false 
    })
      .select('userName email avatarUrl createdAt')
      .sort({ createdAt: 1 }) // Lấy user cũ nhất (giả sử là VIP)
      .limit(parseInt(limit));

    // Mock order data
    const customersWithStats = topUsers.map((user, index) => ({
      userId: user._id,
      name: user.userName,
      email: user.email,
      avatar: user.avatarUrl,
      // Mock data - sẽ được thay bằng data thật từ Order Service
      totalOrders: Math.floor(Math.random() * 50) + 20,
      totalSpent: Math.floor(Math.random() * 50000000) + 20000000,
      memberSince: user.createdAt
    }));

    // Sort by totalSpent
    customersWithStats.sort((a, b) => b.totalSpent - a.totalSpent);

    res.json({
      success: true,
      data: customersWithStats
    });
  } catch (error) {
    console.error('Error in getTopCustomers:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/users/stats/activity
 * Thống kê hoạt động người dùng theo thời gian
 */
exports.getUserActivity = async (req, res) => {
  try {
    const { dateRange = '30days', groupBy = 'day' } = req.query;

    let daysAgo = 30;
    switch (dateRange) {
      case '7days': daysAgo = 7; break;
      case '30days': daysAgo = 30; break;
      case '90days': daysAgo = 90; break;
      case 'year': daysAgo = 365; break;
    }

    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    let groupFormat;
    if (groupBy === 'day') {
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (groupBy === 'week') {
      groupFormat = { $week: '$createdAt' };
    } else {
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    const activity = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isAdmin: false
        }
      },
      {
        $group: {
          _id: groupFormat,
          newUsers: { $sum: 1 },
          verifiedUsers: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: activity.map(item => ({
        date: item._id,
        newUsers: item.newUsers,
        verifiedUsers: item.verifiedUsers
      }))
    });
  } catch (error) {
    console.error('Error in getUserActivity:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
