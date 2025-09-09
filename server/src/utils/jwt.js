const jwt = require('jsonwebtoken')

const jwtCreate = (id) => {
    try {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "15m",
        });
        const resetPasswordToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(
            { id },
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "15d" }
        );

        return { accessToken, refreshToken, resetPasswordToken };
    } catch (e) {
        console.log("Error")
        return null
    }
};

const jwtDecodeToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            ignoreExpiration: true,
        });
    } catch (error) {
        console.log(`Error in decode access token: ${error}`);
        return null;
    }
}

const jwtVerify = (accessToken) => {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
};

module.exports = {
    jwtCreate,
    jwtVerify,
    jwtDecodeToken
}
