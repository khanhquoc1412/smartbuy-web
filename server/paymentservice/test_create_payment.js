const mongoose = require('mongoose');
const paymentService = require('./services/payment.service');
const config = require('./config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const runTest = async () => {
    await connectDB();

    const randomId = Math.floor(Math.random() * 1000000);
    const mockPaymentData = {
        orderId: `ORDER_TEST_${randomId}`,
        userId: '6925d27bb7d40b4b9231f67f',
        amount: 28990000,
        paymentMethod: 'VNPAY',
        customerInfo: {
            fullName: 'Nguyễn Huy Hoàng',
            phone: '0909090911'
        },
        description: `Thanh toan don hang ORDER_TEST_${randomId}`,
        ipAddress: '127.0.0.1'
    };

    try {
        console.log('Testing createPayment...');
        const result = await paymentService.createPayment(mockPaymentData);
        console.log('✅ Success:', result);
    } catch (error) {
        console.error('❌ Failed:', error);
    } finally {
        mongoose.disconnect();
    }
};

runTest();
