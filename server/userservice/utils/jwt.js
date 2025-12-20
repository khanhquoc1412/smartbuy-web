const jwt = require("jsonwebtoken");

const jwtCreate = (id) => {
  try {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "60m",
    });
    const resetPasswordToken = jwt.sign(
      { id },
      process.env.RESET_PASSWORD_TOKEN_PRIVATE_KEY,
      {
        expiresIn: "60m",
      }
    );
    const refreshToken = jwt.sign(
      { id },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken, resetPasswordToken };
  } catch (e) {
    console.log("Error in jwtCreate:", e.message);
    return null;
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
};

const jwtVerify = (accessToken) => {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
};

const jwtVerifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
};

module.exports = {
  jwtCreate,
  jwtVerify,
  jwtVerifyRefreshToken,
  jwtDecodeToken,
};
