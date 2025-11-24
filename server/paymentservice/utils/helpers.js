const crypto = require("crypto");

class PaymentHelpers {
  /**
   * Tạo transaction ID ngẫu nhiên
   * Format: TXN{timestamp}{random}
   */
  static generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp}${random}`;
  }

  /**
   * Validate số tiền
   */
  static validateAmount(amount) {
    if (!amount || isNaN(amount) || amount <= 0) {
      return false;
    }
    return true;
  }

  /**
   * Format tiền VNĐ
   */
  static formatMoney(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  /**
   * Tạo random string
   */
  static generateRandomString(length = 8) {
    return crypto
      .randomBytes(length)
      .toString("hex")
      .substring(0, length)
      .toUpperCase();
  }

  /**
   * Parse query string thành object
   */
  static parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Sort object theo key (cho VNPAY signature)
   */
  static sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  /**
   * Kiểm tra payment đã hết hạn chưa
   */
  static isExpired(expiresAt) {
    return new Date() > new Date(expiresAt);
  }

  /**
   * Tính thời gian còn lại (minutes)
   */
  static getRemainingTime(expiresAt) {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    return Math.max(0, Math.floor(diff / 1000 / 60)); // minutes
  }

  /**
   * Validate email
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (VN)
   */
  static validatePhone(phone) {
    const phoneRegex =
      /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    return phoneRegex.test(phone);
  }

  /**
   * Tạo order code cho VNPAY
   * Format: {transactionId}_{timestamp}
   */
  static generateVNPayOrderCode(transactionId) {
    const timestamp = Date.now();
    return `${transactionId}_${timestamp}`;
  }

  /**
   * Parse VNPAY date format
   * Input: yyyyMMddHHmmss
   * Output: Date object
   */
  static parseVNPayDate(dateString) {
    if (!dateString || dateString.length !== 14) {
      return null;
    }
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }

  /**
   * Format date cho VNPAY
   * Output: yyyyMMddHHmmss
   */
  static formatVNPayDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    const second = String(d.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * Mask card number
   * Input: 1234567890123456
   * Output: 1234********3456
   */
  static maskCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length < 8) {
      return "****";
    }
    const first4 = cardNumber.substring(0, 4);
    const last4 = cardNumber.substring(cardNumber.length - 4);
    return `${first4}${"*".repeat(cardNumber.length - 8)}${last4}`;
  }
}

module.exports = PaymentHelpers;
