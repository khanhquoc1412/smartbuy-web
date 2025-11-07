const User = require('../models/User');

class UserService {
  /**
   * Get all users with pagination, search, and filters
   */
  async getAllUsers({ page = 1, limit = 10, search = '', status = [], role = [], sortBy = 'createdAt', sortOrder = 'desc' }) {
    const query = {};

    // Search by userName or email
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status (isBlocked)
    if (status && status.length > 0) {
      if (status.includes('Hoạt động') && !status.includes('Bị khóa')) {
        query.isBlocked = false;
      } else if (status.includes('Bị khóa') && !status.includes('Hoạt động')) {
        query.isBlocked = true;
      }
    }

    // Filter by role (isAdmin)
    if (role && role.length > 0) {
      if (role.includes('Admin') && !role.includes('Khách hàng')) {
        query.isAdmin = true;
      } else if (role.includes('Khách hàng') && !role.includes('Admin')) {
        query.isAdmin = false;
      }
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    return {
      success: true,
      items: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -refreshToken').lean();
    
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }

    return { success: true, data: user };
  }

  /**
   * Update user information
   */
  async updateUser(userId, updateData) {
    // Don't allow updating sensitive fields via this endpoint
    delete updateData.password;
    delete updateData.refreshToken;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }

    return { success: true, data: user, message: 'Cập nhật thông tin thành công' };
  }

  /**
   * Delete users (soft delete by blocking)
   */
  async deleteUsers(userIds) {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked: true } }
    );

    return {
      success: true,
      message: `Đã khóa ${result.modifiedCount} tài khoản`,
      deletedCount: result.modifiedCount
    };
  }

  /**
   * Toggle user blocked status
   */
  async toggleBlockStatus(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return {
      success: true,
      data: {
        id: user._id,
        isBlocked: user.isBlocked
      },
      message: user.isBlocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản'
    };
  }

  /**
   * Toggle admin role
   */
  async toggleAdminRole(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    return {
      success: true,
      data: {
        id: user._id,
        isAdmin: user.isAdmin
      },
      message: user.isAdmin ? 'Đã cấp quyền Admin' : 'Đã gỡ quyền Admin'
    };
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const [total, active, blocked, admin, verified] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ isAdmin: true }),
      User.countDocuments({ isVerified: true })
    ]);

    return {
      success: true,
      data: {
        total,
        active,
        blocked,
        admin,
        verified,
        unverified: total - verified
      }
    };
  }
}

module.exports = new UserService();
