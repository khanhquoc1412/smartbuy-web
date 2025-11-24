const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    // Liên kết với Order
    orderId: {
      type: String,
      required: true,
      index: true,
    },

    // User thực hiện thanh toán
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Số tiền thanh toán
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Tiền tệ
    currency: {
      type: String,
      default: 'VND',
      enum: ['VND', 'USD'],
    },

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'VNPAY', 'MOMO', 'ZALOPAY', 'PAYPAL', 'CREDIT_CARD'],
      index: true,
    },

    // Trạng thái thanh toán
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded', 'expired'],
      default: 'pending',
      index: true,
    },

    // URL thanh toán (QR code, payment gateway URL)
    paymentUrl: {
      type: String,
    },

    // Mã giao dịch từ payment gateway
    transactionId: {
      type: String,
      index: true,
      sparse: true,
    },

    // Mã giao dịch của bên thứ 3 (VNPAY, MOMO, etc.)
    externalTransactionId: {
      type: String,
      sparse: true,
    },

    // Mã ngân hàng (nếu thanh toán qua ngân hàng)
    bankCode: {
      type: String,
    },

    // Tên ngân hàng
    bankName: {
      type: String,
    },

    // Loại thẻ (ATM, VISA, MASTERCARD, etc.)
    cardType: {
      type: String,
    },

    // Response code từ payment gateway
    responseCode: {
      type: String,
    },

    // Message từ payment gateway
    responseMessage: {
      type: String,
    },

    // Thông tin khách hàng
    customerInfo: {
      fullName: String,
      email: String,
      phone: String,
    },

    // Mô tả giao dịch
    description: {
      type: String,
      maxlength: 255,
    },

    // Thời gian thanh toán
    paidAt: {
      type: Date,
    },

    // Thời gian hết hạn thanh toán
    expiresAt: {
      type: Date,
      index: true,
    },

    // IP address của người thanh toán
    ipAddress: {
      type: String,
    },

    // Metadata từ payment gateway
    gatewayData: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Thông tin hoàn tiền (nếu có)
    refundInfo: {
      refundAmount: Number,
      refundedAt: Date,
      refundTransactionId: String,
      refundReason: String,
      refundStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
      },
    },

    // Số lần retry (nếu thanh toán thất bại)
    retryCount: {
      type: Number,
      default: 0,
    },

    // Lịch sử trạng thái
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        responseCode: String,
      },
    ],

    // Webhook đã gửi chưa
    webhookSent: {
      type: Boolean,
      default: false,
    },

    webhookSentAt: {
      type: Date,
    },

    // Số lần gửi webhook
    webhookRetryCount: {
      type: Number,
      default: 0,
    },

    // Metadata bổ sung
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// ============ INDEXES ============
PaymentSchema.index({ orderId: 1, status: 1 });
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ transactionId: 1 }, { sparse: true, unique: true });
PaymentSchema.index({ status: 1, expiresAt: 1 });
PaymentSchema.index({ createdAt: -1 });

// ============ METHODS ============

/**
 * Kiểm tra payment đã hết hạn chưa
 */
PaymentSchema.methods.isExpired = function () {
  return this.expiresAt && new Date() > this.expiresAt;
};

/**
 * Cập nhật trạng thái
 */
PaymentSchema.methods.updateStatus = function (newStatus, note, responseCode) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    responseCode,
  });

  if (newStatus === 'paid') {
    this.paidAt = new Date();
  }
};

/**
 * Kiểm tra có thể refund không
 */
PaymentSchema.methods.canRefund = function () {
  return this.status === 'paid' && !this.refundInfo;
};

// ============ STATICS ============

/**
 * Tìm payment theo orderId
 */
PaymentSchema.statics.findByOrderId = function (orderId) {
  return this.findOne({ orderId }).sort({ createdAt: -1 });
};

/**
 * Tìm payment đang chờ của user
 */
PaymentSchema.statics.findPendingByUser = function (userId) {
  return this.find({
    userId,
    status: { $in: ['pending', 'processing'] },
  }).sort({ createdAt: -1 });
};

/**
 * Tìm payment hết hạn cần cancel
 */
PaymentSchema.statics.findExpiredPayments = function () {
  return this.find({
    status: { $in: ['pending', 'processing'] },
    expiresAt: { $lte: new Date() },
  });
};

// ============ VIRTUALS ============

PaymentSchema.virtual('isSuccessful').get(function () {
  return this.status === 'paid';
});

PaymentSchema.virtual('isFailed').get(function () {
  return ['failed', 'cancelled', 'expired'].includes(this.status);
});

PaymentSchema.virtual('isPending').get(function () {
  return ['pending', 'processing'].includes(this.status);
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;