const User = require('../models/User');

class UserService {
  /**
   * Create new user
   */
  async createUser(userData) {
    const { userName, email, password, isAdmin } = userData;

    // Validate required fields
    if (!email || !password) {
      const error = new Error('Email và mật khẩu là bắt buộc');
      error.statusCode = 400;
      throw error;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email đã tồn tại');
      error.statusCode = 400;
      throw error;
    }

    // Create new user
    const user = new User({
      userName: userName || 'User',
      email,
      password, // Will be hashed by pre-save hook
      isAdmin: isAdmin || false,
      isVerified: false,
      isBlocked: false,
      avatarUrl: '/src/assets/svg/animal-avatar-bear.svg' // Default avatar
    });

    await user.save();

    // Return user without sensitive data
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return { 
      success: true, 
      data: userObject, 
      message: 'Tạo tài khoản thành công' 
    };
  }

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
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }

    // Update allowed fields
    if (updateData.userName) user.userName = updateData.userName;
    if (updateData.hasOwnProperty('isAdmin')) user.isAdmin = updateData.isAdmin;
    if (updateData.hasOwnProperty('isBlocked')) user.isBlocked = updateData.isBlocked;
    if (updateData.hasOwnProperty('isVerified')) user.isVerified = updateData.isVerified;
    
    // Update password if provided
    if (updateData.password) {
      user.password = updateData.password; // Will be hashed by pre-save hook
    }

    await user.save();

    // Return user without sensitive data
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return { success: true, data: userObject, message: 'Cập nhật thông tin thành công' };
  }

  /**
   * Delete users (permanently delete)
   */
  async deleteUsers(userIds) {
    const result = await User.deleteMany({ _id: { $in: userIds } });

    return {
      success: true,
      message: `Đã xóa ${result.deletedCount} tài khoản`,
      deletedCount: result.deletedCount
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

  /**
   * Bulk block/unblock users
   */
  async bulkBlockUsers(userIds, isBlocked) {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked } }
    );

    return {
      success: true,
      message: isBlocked 
        ? `Đã khóa ${result.modifiedCount} tài khoản` 
        : `Đã mở khóa ${result.modifiedCount} tài khoản`,
      modifiedCount: result.modifiedCount
    };
  }

  /**
   * Bulk set admin role
   */
  async bulkSetAdmin(userIds, isAdmin) {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isAdmin } }
    );

    return {
      success: true,
      message: isAdmin 
        ? `Đã cấp quyền Admin cho ${result.modifiedCount} tài khoản` 
        : `Đã gỡ quyền Admin khỏi ${result.modifiedCount} tài khoản`,
      modifiedCount: result.modifiedCount
    };
  }
}

module.exports = new UserService();
