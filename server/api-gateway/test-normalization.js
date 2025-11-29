const axios = require('axios');

async function testEmailNormalization() {
    const email = `test.user.${Date.now()}@gmail.com`;
    const password = 'password123';

    try {
        console.log(`1. Registering user: ${email}`);
        const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
            userName: 'Test User',
            email,
            password,
            confirmPassword: password
        });
        console.log('Register success:', registerResponse.data);

        // Now try to verify with the SAME email (with dots)
        // If normalization was removed, this should work (or at least find the user, even if OTP is wrong)

        console.log(`2. Verifying with email: ${email} (expecting "Wrong OTP" error, NOT "User not found")`);
        try {
            await axios.post('http://localhost:3000/api/auth/verify-email', {
                email,
                otp: '000000'
            });
        } catch (verifyError) {
            if (verifyError.response) {
                console.log('Verify error:', verifyError.response.data.message);
                if (verifyError.response.data.message === 'Mã OTP không chính xác') {
                    console.log('SUCCESS: User was found with the correct email!');
                } else if (verifyError.response.data.message.includes('Không tìm thấy tài khoản')) {
                    console.log('FAILURE: User was NOT found. Normalization might still be active.');
                }
            }
        }

    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status);
            console.log('Error data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testEmailNormalization();
