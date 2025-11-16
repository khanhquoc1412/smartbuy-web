const Order = require('../models/Order');
const moment = require('moment');

/**
 * Lấy date range từ query parameter
 * @param {string} range - '7days', '30days', '90days', 'year', hoặc custom
 * @param {string} startDate - Custom start date (YYYY-MM-DD)
 * @param {string} endDate - Custom end date (YYYY-MM-DD)
 * @returns {Object} { start, end }
 */
const getDateRange = (range, startDate, endDate) => {
  const now = moment().endOf('day');
  let start, end;

  switch (range) {
    case '7days':
      start = moment().subtract(7, 'days').startOf('day');
      end = now;
      break;
    case '30days':
      start = moment().subtract(30, 'days').startOf('day');
      end = now;
      break;
    case '90days':
      start = moment().subtract(90, 'days').startOf('day');
      end = now;
      break;
    case 'year':
      start = moment().subtract(1, 'year').startOf('day');
      end = now;
      break;
    case 'custom':
      if (startDate && endDate) {
        start = moment(startDate).startOf('day');
        end = moment(endDate).endOf('day');
      } else {
        // Mặc định 30 ngày nếu không có custom date
        start = moment().subtract(30, 'days').startOf('day');
        end = now;
      }
      break;
    default:
      // Mặc định 30 ngày
      start = moment().subtract(30, 'days').startOf('day');
      end = now;
  }

  return { start: start.toDate(), end: end.toDate() };
};

/**
 * GET /api/orders/stats/overview
 * Lấy tổng quan: doanh thu, số đơn, khách hàng mới, AOV
 */
exports.getOverview = async (req, res) => {
  try {
    const { dateRange = '30days', startDate, endDate } = req.query;
    const { start, end } = getDateRange(dateRange, startDate, endDate);

    // Tính doanh thu và số đơn trong khoảng thời gian
    const currentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $nin: ['cancelled', 'payment_failed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          uniqueCustomers: { $addToSet: '$user' }
        }
      }
    ]);

    // Tính số liệu kỳ trước để so sánh
    const daysInRange = moment(end).diff(moment(start), 'days');
    const previousStart = moment(start).subtract(daysInRange, 'days').toDate();
    const previousEnd = start;

    const previousStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStart, $lt: previousEnd },
          status: { $nin: ['cancelled', 'payment_failed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const current = currentStats[0] || { totalRevenue: 0, totalOrders: 0, uniqueCustomers: [] };
    const previous = previousStats[0] || { totalRevenue: 0, totalOrders: 0 };

    // Tính % thay đổi
    const revenueChange = previous.totalRevenue > 0 
      ? ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue * 100).toFixed(1)
      : 0;

    const ordersChange = previous.totalOrders > 0
      ? ((current.totalOrders - previous.totalOrders) / previous.totalOrders * 100).toFixed(1)
      : 0;

    // Average Order Value
    const aov = current.totalOrders > 0 
      ? (current.totalRevenue / current.totalOrders).toFixed(0)
      : 0;

    const previousAov = previous.totalOrders > 0
      ? (previous.totalRevenue / previous.totalOrders)
      : 0;

    const aovChange = previousAov > 0
      ? ((aov - previousAov) / previousAov * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(current.totalRevenue),
        revenueChange: parseFloat(revenueChange),
        totalOrders: current.totalOrders,
        ordersChange: parseFloat(ordersChange),
        newCustomers: current.uniqueCustomers.length,
        customersChange: 0, // Cần query riêng từ user-manager-service nếu muốn chính xác
        averageOrderValue: parseInt(aov),
        aovChange: parseFloat(aovChange),
        dateRange: { start, end }
      }
    });
  } catch (error) {
    console.error('Error in getOverview:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/orders/stats/revenue-timeline
 * Lấy doanh thu theo timeline (daily/weekly/monthly)
 */
exports.getRevenueTimeline = async (req, res) => {
  try {
    const { dateRange = '7days', startDate, endDate, groupBy = 'day' } = req.query;
    const { start, end } = getDateRange(dateRange, startDate, endDate);

    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = { $hour: '$createdAt' };
        break;
      case 'day':
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'week':
        groupFormat = { $week: '$createdAt' };
        break;
      case 'month':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const timeline = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $nin: ['cancelled', 'payment_failed'] }
        }
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format labels
    const data = timeline.map(item => ({
      label: item._id,
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));

    res.json({
      success: true,
      data,
      dateRange: { start, end }
    });
  } catch (error) {
    console.error('Error in getRevenueTimeline:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/orders/stats/by-status
 * Lấy thống kê đơn hàng theo trạng thái
 */
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { dateRange = '30days', startDate, endDate } = req.query;
    const { start, end } = getDateRange(dateRange, startDate, endDate);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Map status sang tiếng Việt và group lại
    const statusMap = {
      'completed': 'Hoàn thành',
      'delivered': 'Hoàn thành',
      'shipping': 'Đang giao',
      'ready_to_ship': 'Đang giao',
      'processing': 'Đang giao',
      'pending': 'Chờ xử lý',
      'pending_payment': 'Chờ xử lý',
      'confirmed': 'Chờ xử lý',
      'cancelled': 'Đã hủy',
      'payment_failed': 'Đã hủy',
      'returned': 'Đã hủy'
    };

    const grouped = {};
    stats.forEach(item => {
      const label = statusMap[item._id] || item._id;
      if (!grouped[label]) {
        grouped[label] = { count: 0, totalValue: 0 };
      }
      grouped[label].count += item.count;
      grouped[label].totalValue += item.totalValue;
    });

    const data = Object.keys(grouped).map(label => ({
      label,
      count: grouped[label].count,
      totalValue: Math.round(grouped[label].totalValue)
    }));

    res.json({
      success: true,
      data,
      dateRange: { start, end }
    });
  } catch (error) {
    console.error('Error in getOrdersByStatus:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/orders/stats/peak-hours
 * Lấy thống kê giờ cao điểm đặt hàng
 */
exports.getPeakHours = async (req, res) => {
  try {
    const { dateRange = '30days', startDate, endDate } = req.query;
    const { start, end } = getDateRange(dateRange, startDate, endDate);

    const hourlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $project: {
          hour: { $hour: '$createdAt' },
          totalPrice: 1
        }
      },
      {
        $group: {
          _id: '$hour',
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Group vào các khung giờ
    const timeSlots = {
      '0-3h': { orders: 0, revenue: 0 },
      '3-6h': { orders: 0, revenue: 0 },
      '6-9h': { orders: 0, revenue: 0 },
      '9-12h': { orders: 0, revenue: 0 },
      '12-15h': { orders: 0, revenue: 0 },
      '15-18h': { orders: 0, revenue: 0 },
      '18-21h': { orders: 0, revenue: 0 },
      '21-24h': { orders: 0, revenue: 0 }
    };

    hourlyStats.forEach(stat => {
      const hour = stat._id;
      let slot;
      if (hour >= 0 && hour < 3) slot = '0-3h';
      else if (hour >= 3 && hour < 6) slot = '3-6h';
      else if (hour >= 6 && hour < 9) slot = '6-9h';
      else if (hour >= 9 && hour < 12) slot = '9-12h';
      else if (hour >= 12 && hour < 15) slot = '12-15h';
      else if (hour >= 15 && hour < 18) slot = '15-18h';
      else if (hour >= 18 && hour < 21) slot = '18-21h';
      else slot = '21-24h';

      timeSlots[slot].orders += stat.orders;
      timeSlots[slot].revenue += stat.revenue;
    });

    const data = Object.keys(timeSlots).map(slot => ({
      label: slot,
      orders: timeSlots[slot].orders,
      revenue: Math.round(timeSlots[slot].revenue)
    }));

    res.json({
      success: true,
      data,
      dateRange: { start, end }
    });
  } catch (error) {
    console.error('Error in getPeakHours:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET /api/orders/stats/payment-methods
 * Lấy thống kê theo phương thức thanh toán
 */
exports.getPaymentMethods = async (req, res) => {
  try {
    const { dateRange = '30days', startDate, endDate } = req.query;
    const { start, end } = getDateRange(dateRange, startDate, endDate);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $nin: ['cancelled', 'payment_failed'] }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Map sang tên tiếng Việt
    const methodMap = {
      'COD': 'Thanh toán khi nhận hàng',
      'VNPAY': 'Chuyển khoản',
      'MOMO': 'Ví điện tử',
      'ZALOPAY': 'Ví điện tử',
      'PAYPAL': 'Thẻ quốc tế',
      'CREDIT_CARD': 'Thẻ quốc tế'
    };

    const data = stats.map(item => ({
      method: item._id,
      label: methodMap[item._id] || item._id,
      count: item.count,
      totalValue: Math.round(item.totalValue),
      percentage: 0 // Sẽ tính ở client
    }));

    const totalOrders = data.reduce((sum, item) => sum + item.count, 0);
    data.forEach(item => {
      item.percentage = totalOrders > 0 
        ? parseFloat((item.count / totalOrders * 100).toFixed(1))
        : 0;
    });

    res.json({
      success: true,
      data,
      dateRange: { start, end }
    });
  } catch (error) {
    console.error('Error in getPaymentMethods:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
