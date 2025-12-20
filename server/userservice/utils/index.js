const { hashPassword, comparePassword } = require("./bcrypt");
const {
  jwtCreate,
  jwtVerify,
  jwtVerifyRefreshToken,
  jwtVerifyResetPasswordToken,  // ✅ Thêm export
  jwtDecodeToken,
} = require("./jwt");

const { createCryptoString } = require("./cryptoString");

module.exports = {
  hashPassword,
  comparePassword,
  jwtCreate,
  jwtVerify,
  jwtVerifyRefreshToken,
  jwtVerifyResetPasswordToken,  // ✅ Thêm export
  jwtDecodeToken,
  createCryptoString,
};
