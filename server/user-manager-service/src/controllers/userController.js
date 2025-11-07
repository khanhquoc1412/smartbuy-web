const userService = require('../services/userService');

class UserController {
  /**
   * @route   GET /api/users
   * @desc    Get all users with pagination and filters
   * @access  Admin
   */
  async getAllUsers(req, res, next) {
    try {
      const { page, limit, search, status, role, sortBy, sortOrder } = req.query;
      
      const result = await userService.getAllUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        status: status ? (Array.isArray(status) ? status : [status]) : [],
        role: role ? (Array.isArray(role) ? role : [role]) : [],
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc'
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/users/:id
   * @desc    Get user by ID
   * @access  Admin
   */
  async getUserById(req, res, next) {
    try {
      const result = await userService.getUserById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PUT /api/users/:id
   * @desc    Update user information
   * @access  Admin
   */
  async updateUser(req, res, next) {
    try {
      const result = await userService.updateUser(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   DELETE /api/users
   * @desc    Delete multiple users (soft delete)
   * @access  Admin
   */
  async deleteUsers(req, res, next) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp danh sách ID người dùng'
        });
      }

      const result = await userService.deleteUsers(ids);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/users/:id/toggle-block
   * @desc    Toggle user blocked status
   * @access  Admin
   */
  async toggleBlockStatus(req, res, next) {
    try {
      const result = await userService.toggleBlockStatus(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/users/:id/toggle-admin
   * @desc    Toggle admin role
   * @access  Admin
   */
  async toggleAdminRole(req, res, next) {
    try {
      const result = await userService.toggleAdminRole(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/users/stats
   * @desc    Get user statistics
   * @access  Admin
   */
  async getUserStats(req, res, next) {
    try {
      const result = await userService.getUserStats();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
