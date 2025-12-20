const Address = require('../models/Address');

class AddressService {
  /**
   * Get all addresses of a user
   */
  async getUserAddresses(userId) {
    if (!userId) {
      const error = new Error("User ID là bắt buộc");
      error.statusCode = 400;
      throw error;
    }

    const addresses = await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    }); // Default address first

    return {
      success: true,
      data: addresses,
      message: "Lấy danh sách địa chỉ thành công",
    };
  }

  /**
   * Get address by ID
   */
  async getAddressById(addressId) {
    const address = await Address.findById(addressId);

    if (!address) {
      const error = new Error("Không tìm thấy địa chỉ");
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      data: address,
      message: "Lấy thông tin địa chỉ thành công",
    };
  }

  /**
   * Create new address
   */
  async createAddress(addressData) {
    const {
      userId,
      label,
      fullName,
      phone,
      province,
      district,
      ward,
      address,
      isDefault,
    } = addressData;

    // Validate required fields
    if (
      !userId ||
      !fullName ||
      !phone ||
      !province ||
      !district ||
      !ward ||
      !address
    ) {
      const error = new Error("Vui lòng điền đầy đủ thông tin địa chỉ");
      error.statusCode = 400;
      throw error;
    }

    // If this is set as default, unset other default addresses of this user
    if (isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Create new address
    const newAddress = new Address({
      userId,
      label: label || "Nhà riêng",
      fullName,
      phone,
      province,
      district,
      ward,
      address,
      isDefault: isDefault || false,
    });

    await newAddress.save();

    return {
      success: true,
      data: newAddress,
      message: "Thêm địa chỉ thành công",
    };
  }

  /**
   * Update address
   */
  async updateAddress(addressId, updateData) {
    const address = await Address.findById(addressId);

    if (!address) {
      const error = new Error("Không tìm thấy địa chỉ");
      error.statusCode = 404;
      throw error;
    }

    // If setting as default, unset other default addresses
    if (updateData.isDefault === true) {
      await Address.updateMany(
        { userId: address.userId, _id: { $ne: addressId }, isDefault: true },
        { isDefault: false }
      );
    }

    // Update fields
    const allowedFields = [
      "label",
      "fullName",
      "phone",
      "province",
      "district",
      "ward",
      "address",
      "isDefault",
    ];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        address[field] = updateData[field];
      }
    });

    await address.save();

    return {
      success: true,
      data: address,
      message: "Cập nhật địa chỉ thành công",
    };
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(addressId) {
    const address = await Address.findById(addressId);

    if (!address) {
      const error = new Error("Không tìm thấy địa chỉ");
      error.statusCode = 404;
      throw error;
    }

    // Unset all default addresses of this user
    await Address.updateMany(
      { userId: address.userId, isDefault: true },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return {
      success: true,
      data: address,
      message: "Đã đặt địa chỉ mặc định",
    };
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId) {
    const address = await Address.findById(addressId);

    if (!address) {
      const error = new Error("Không tìm thấy địa chỉ");
      error.statusCode = 404;
      throw error;
    }

    // If deleting default address, set another address as default
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({
        userId: address.userId,
        _id: { $ne: addressId },
      }).sort({ createdAt: -1 });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    await Address.findByIdAndDelete(addressId);

    return {
      success: true,
      message: "Xóa địa chỉ thành công",
    };
  }

  /**
   * Bulk delete addresses
   */
  async bulkDeleteAddresses(addressIds) {
    if (!addressIds || !Array.isArray(addressIds) || addressIds.length === 0) {
      const error = new Error("Vui lòng cung cấp danh sách ID địa chỉ");
      error.statusCode = 400;
      throw error;
    }

    const result = await Address.deleteMany({ _id: { $in: addressIds } });

    return {
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `Đã xóa ${result.deletedCount} địa chỉ`,
    };
  }
}

module.exports = new AddressService();
