const { StatusCodes } = require("http-status-codes");
const Address = require("../models/address");
const { NotFoundError, BadRequestError } = require("../../src/errors");

/**
 * @desc    Get all addresses of user
 * @route   GET /api/user/addresses
 * @access  Private
 */
exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Đổi từ id -> userId
    
    const addresses = await Address.find({ userId })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Lấy danh sách địa chỉ thành công',
      data: { 
        addresses: addresses || [],
        total: addresses?.length || 0,
      },
    });
  } catch (error) {
    console.error('❌ Get addresses error:', error);
    next(error);
  }
};

/**
 * @desc    Get single address
 * @route   GET /api/user/addresses/:addressId
 * @access  Private
 */
exports.getAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Đổi
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, userId });
    
    if (!address) {
      throw new NotFoundError('Không tìm thấy địa chỉ');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Lấy thông tin địa chỉ thành công',
      data: { address },
    });
  } catch (error) {
    console.error('❌ Get address error:', error);
    next(error);
  }
};

/**
 * @desc    Get default address
 * @route   GET /api/user/addresses/default
 * @access  Private
 */
exports.getDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Đổi

    const defaultAddress = await Address.findOne({ userId, isDefault: true });

    res.status(StatusCodes.OK).json({
      success: true,
      message: defaultAddress ? 'Lấy địa chỉ mặc định thành công' : 'Chưa có địa chỉ mặc định',
      data: { address: defaultAddress || null },
    });
  } catch (error) {
    console.error('❌ Get default address error:', error);
    next(error);
  }
};

/**
 * @desc    Add new address
 * @route   POST /api/user/addresses
 * @access  Private
 */
exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Từ auth middleware
    const { 
      label,
      fullName, 
      phone, 
      province, 
      district, 
      ward, 
      address,
      isDefault 
    } = req.body;

    console.log('📝 Add address request:', { userId, body: req.body });

    // Validation
    if (!fullName || !phone || !province || !district || !ward || !address) {
      throw new BadRequestError('Thiếu thông tin địa chỉ bắt buộc');
    }

    // Nếu set làm default
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    // Nếu chưa có địa chỉ nào, tự động set làm default
    const existingCount = await Address.countDocuments({ userId });
    const shouldBeDefault = isDefault || existingCount === 0;

    // Tạo address mới
    const newAddress = await Address.create({
      userId,
      label: label || 'Nhà riêng',
      fullName,
      phone,
      province,
      district,
      ward,
      address,
      isDefault: shouldBeDefault,
    });

    console.log('✅ Address created:', newAddress);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: { address: newAddress },
    });
  } catch (error) {
    console.error('❌ Add address error:', error);
    next(error);
  }
};

/**
 * @desc    Update address
 * @route   PUT /api/user/addresses/:addressId
 * @access  Private
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Đổi
    const { addressId } = req.params;
    const updates = req.body;

    const address = await Address.findOne({ _id: addressId, userId });
    
    if (!address) {
      throw new NotFoundError('Không tìm thấy địa chỉ');
    }

    // ✅ Validate phone if provided
    if (updates.phone) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(updates.phone)) {
        throw new BadRequestError('Số điện thoại không hợp lệ');
      }
    }

    // ✅ Update allowed fields
    const allowedFields = [
      'label',
      'fullName', 
      'phone', 
      'province', 
      'district', 
      'ward', 
      'address'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        address[field] = updates[field];
      }
    });

    // ✅ Handle default
    if (updates.isDefault === true) {
      await Address.updateMany({ userId }, { isDefault: false });
      address.isDefault = true;
    }

    await address.save();

    console.log('✅ Address updated:', address._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: { address },
    });
  } catch (error) {
    console.error('❌ Update address error:', error);
    next(error);
  }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/user/addresses/:addressId
 * @access  Private
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Đổi
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, userId });
    
    if (!address) {
      throw new NotFoundError('Không tìm thấy địa chỉ');
    }

    const wasDefault = address.isDefault;
    
    await address.deleteOne();
    console.log('✅ Address deleted:', addressId);

    // ✅ Nếu xóa địa chỉ default, set địa chỉ đầu tiên làm default
    if (wasDefault) {
      const firstAddress = await Address.findOne({ userId }).sort({ createdAt: 1 });
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save();
        console.log('✅ New default address set:', firstAddress._id);
      }
    }

    const remainingAddresses = await Address.find({ userId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Xóa địa chỉ thành công',
      data: { 
        addresses: remainingAddresses,
        total: remainingAddresses.length,
      },
    });
  } catch (error) {
    console.error('❌ Delete address error:', error);
    next(error);
  }
};

/**
 * @desc    Set default address
 * @route   PATCH /api/user/addresses/:addressId/default
 * @access  Private
 */
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // ✅ Đổi
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, userId });
    
    if (!address) {
      throw new NotFoundError('Không tìm thấy địa chỉ');
    }

    // ✅ Bỏ default của tất cả
    await Address.updateMany({ userId }, { isDefault: false });
    
    // ✅ Set address này làm default
    address.isDefault = true;
    await address.save();

    console.log('✅ Default address set:', address._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công',
      data: { address },
    });
  } catch (error) {
    console.error('❌ Set default address error:', error);
    next(error);
  }
};