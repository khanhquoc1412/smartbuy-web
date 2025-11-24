/**
 * Payment constants
 */

const PAYMENT_STATUS = {
  PENDING: "pending", // Chờ thanh toán
  PROCESSING: "processing", // Đang xử lý
  PAID: "paid", // Đã thanh toán
  FAILED: "failed", // Thanh toán thất bại
  CANCELLED: "cancelled", // Đã hủy
  EXPIRED: "expired", // Hết hạn
  REFUNDED: "refunded", // Đã hoàn tiền
};

const PAYMENT_METHODS = {
  COD: "COD", // Thanh toán khi nhận hàng
  VNPAY: "VNPAY", // VNPAY QR/Internet Banking
  MOMO: "MOMO", // Ví MoMo
  ZALOPAY: "ZALOPAY", // ZaloPay
  CREDIT_CARD: "CREDIT_CARD", // Thẻ tín dụng
};

const VNPAY_RESPONSE_CODE = {
  "00": "Giao dịch thành công",
  "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
  "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
  10: "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
  11: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
  12: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
  13: "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
  24: "Giao dịch không thành công do: Khách hàng hủy giao dịch",
  51: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
  65: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá giới hạn giao dịch trong ngày.",
  75: "Ngân hàng thanh toán đang bảo trì.",
  79: "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
  99: "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
};

const TRANSACTION_TYPE = {
  PAYMENT: "payment", // Thanh toán đơn hàng
  REFUND: "refund", // Hoàn tiền
  CANCEL: "cancel", // Hủy giao dịch
};

module.exports = {
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  VNPAY_RESPONSE_CODE,
  TRANSACTION_TYPE,
};
