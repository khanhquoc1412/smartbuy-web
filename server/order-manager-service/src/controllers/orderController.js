const Order = require('../models/Order');
const mongoose = require('mongoose');

// GET /api/orders - Get all orders with filters
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      orderStatus = [],
      paymentStatus = [],
      dateFrom,
      dateTo
    } = req.query;

    // Build filter
    const filter = {};

    // Search by order number or customer name
    if (search) {
      filter.$or = [
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by order status
    if (orderStatus && orderStatus.length > 0) {
      filter.status = { $in: Array.isArray(orderStatus) ? orderStatus : [orderStatus] };
    }

    // Filter by payment status
    if (paymentStatus && paymentStatus.length > 0) {
      filter.paymentStatus = { $in: Array.isArray(paymentStatus) ? paymentStatus : [paymentStatus] };
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    // Pagination
    const skip = (page - 1) * limit;
    const totalItems = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean({ virtuals: true });

    res.json({
      success: true,
      items: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy danh sách đơn hàng'
    });
  }
};

// GET /api/orders/stats - Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders count
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Today's revenue (orders that became completed/delivered today)
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'delivered'] },
          paymentStatus: 'paid',
          // Check if the last status history entry (completed/delivered) was today
          statusHistory: {
            $elemMatch: {
              status: { $in: ['completed', 'delivered'] },
              timestamp: { $gte: today, $lt: tomorrow }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // Shipping orders
    const shippingOrders = await Order.countDocuments({
      status: { $in: ['shipping', 'ready_to_ship'] }
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'processing'] }
    });

    // Completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalLast30Days = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const completedLast30Days = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed'
    });

    const completionRate = totalLast30Days > 0 
      ? Math.round((completedLast30Days / totalLast30Days) * 100) 
      : 0;

    // Revenue chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $in: ['completed', 'delivered'] },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Create all 7 days array
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const revenue = revenueByDay.find(d => d._id === dateStr)?.revenue || 0;
      last7Days.push({ date: dateStr, revenue });
    }

    const revenueChart = {
      labels: last7Days.map(d => {
        const date = new Date(d.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      data: last7Days.map(d => d.revenue)
    };

    // Status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Status labels in Vietnamese
    const statusLabels = {
      pending_payment: 'Chờ thanh toán',
      payment_failed: 'Thanh toán thất bại',
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang chuẩn bị',
      ready_to_ship: 'Sẵn sàng giao',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      returned: 'Đã trả hàng'
    };

    const totalOrders = statusDistribution.reduce((sum, s) => sum + s.count, 0);

    const statusChart = {
      labels: statusDistribution.map(s => {
        const label = statusLabels[s._id] || s._id;
        const percentage = totalOrders > 0 ? ((s.count / totalOrders) * 100).toFixed(1) : 0;
        return `${label} (${percentage}%)`;
      }),
      data: statusDistribution.map(s => s.count)
    };

    res.json({
      success: true,
      data: {
        todayOrders,
        todayRevenue,
        shippingOrders,
        pendingOrders,
        completionRate,
        revenueChart,
        statusChart
      }
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê đơn hàng'
    });
  }
};

// GET /api/orders/:id - Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy thông tin đơn hàng'
    });
  }
};

// POST /api/orders - Create new order
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.user || !orderData.orderItems || orderData.orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin đơn hàng'
      });
    }

    // Create order
    const order = new Order(orderData);

    // Add initial status to history
    order.statusHistory.push({
      status: order.status,
      timestamp: new Date(),
      actorType: 'system',
      note: 'Đơn hàng được tạo'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi tạo đơn hàng'
    });
  }
};

// PATCH /api/orders/:id/status - Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu trạng thái mới'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Update status using method
    order.addStatusHistory(status, null, 'admin', note);
    await order.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi cập nhật trạng thái đơn hàng'
    });
  }
};

// PATCH /api/orders/:id - Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi cập nhật đơn hàng'
    });
  }
};

// DELETE /api/orders - Bulk delete orders
exports.bulkDeleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách ID không hợp lệ'
      });
    }

    const result = await Order.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `Đã xóa ${result.deletedCount} đơn hàng`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting orders:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xóa đơn hàng'
    });
  }
};

// DELETE /api/orders/:id - Delete single order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa đơn hàng thành công'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xóa đơn hàng'
    });
  }
};
