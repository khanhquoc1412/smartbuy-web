const axios = require('axios');
const config = require('../config/config');
const PaymentHelpers = require('../utils/helpers');

class WebhookService {
  /**
   * Gửi thông báo tới OrderService
   */
  async notifyOrderService(payment, paymentStatus) {
    try {
      const webhookUrl = `${config.ORDER_SERVICE_URL}/api/orders/payment-callback`;

      const payload = {
        paymentId: payment._id.toString(),
        orderId: payment.orderId,
        paymentStatus,
        transactionData: {
          transactionId: payment.transactionId,
          externalTransactionId: payment.externalTransactionId,
          amount: payment.amount,
          paidAt: payment.paidAt,
          bankCode: payment.bankCode,
          cardType: payment.cardType,
          responseCode: payment.responseCode,
          responseMessage: payment.responseMessage,
        },
      };

      console.log(`📤 Sending webhook to OrderService: ${webhookUrl}`);

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': config.WEBHOOK_SECRET,
        },
        timeout: 10000,
      });

      // Đánh dấu đã gửi webhook
      payment.webhookSent = true;
      payment.webhookSentAt = new Date();
      await payment.save();

      console.log(`✅ Webhook sent successfully to OrderService`);

      return response.data;
    } catch (error) {
      console.error('❌ Webhook error:', error.message);

      // Tăng retry count
      payment.webhookRetryCount = (payment.webhookRetryCount || 0) + 1;
      await payment.save();

      // Retry với exponential backoff (nếu cần)
      if (payment.webhookRetryCount < 3) {
        console.log(`🔄 Retrying webhook... (${payment.webhookRetryCount}/3)`);
        await PaymentHelpers.sleep(2000 * payment.webhookRetryCount);
        return this.notifyOrderService(payment, paymentStatus);
      }

      throw error;
    }
  }

  /**
   * Retry các webhook chưa gửi được
   */
  async retryFailedWebhooks() {
    try {
      const Payment = require('../models/payment');

      const failedWebhooks = await Payment.find({
        webhookSent: false,
        status: { $in: ['paid', 'failed'] },
        webhookRetryCount: { $lt: 5 },
      }).limit(10);

      console.log(`🔄 Retrying ${failedWebhooks.length} failed webhooks`);

      for (const payment of failedWebhooks) {
        try {
          const status = payment.status === 'paid' ? 'paid' : 'failed';
          await this.notifyOrderService(payment, status);
        } catch (error) {
          console.error(`❌ Retry webhook failed for payment ${payment._id}:`, error.message);
        }
      }

      return failedWebhooks.length;
    } catch (error) {
      console.error('❌ Retry failed webhooks error:', error);
      return 0;
    }
  }
}

module.exports = new WebhookService();