const axios = require('axios');

async function testRoute() {
    try {
        console.log('Testing POST http://localhost:3004/api/payments/create');
        const response = await axios.post('http://localhost:3004/api/payments/create', {}, {
            validateStatus: () => true // Don't throw on error status
        });
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRoute();
