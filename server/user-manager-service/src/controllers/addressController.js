const addressService = require('../services/addressService');

class AddressController {
  /**
   * @route   GET /api/addresses/user/:userId
   * @desc    Get all addresses of a user
   * @access  Admin/User
   */
  async getUserAddresses(req, res, next) {
    try {
      const result = await addressService.getUserAddresses(req.params.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/addresses/:id
   * @desc    Get address by ID
   * @access  Admin/User
   */
  async getAddressById(req, res, next) {
    try {
      const result = await addressService.getAddressById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   POST /api/addresses
   * @desc    Create new address
   * @access  Admin/User
   */
  async createAddress(req, res, next) {
    try {
      const result = await addressService.createAddress(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PUT /api/addresses/:id
   * @desc    Update address
   * @access  Admin/User
   */
  async updateAddress(req, res, next) {
    try {
      const result = await addressService.updateAddress(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/addresses/:id/set-default
   * @desc    Set address as default
   * @access  Admin/User
   */
  async setDefaultAddress(req, res, next) {
    try {
      const result = await addressService.setDefaultAddress(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   DELETE /api/addresses/:id
   * @desc    Delete address
   * @access  Admin/User
   */
  async deleteAddress(req, res, next) {
    try {
      const result = await addressService.deleteAddress(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   DELETE /api/addresses
   * @desc    Bulk delete addresses
   * @access  Admin
   */
  async bulkDeleteAddresses(req, res, next) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp danh sách ID địa chỉ'
        });
      }

      const result = await addressService.bulkDeleteAddresses(ids);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AddressController();
