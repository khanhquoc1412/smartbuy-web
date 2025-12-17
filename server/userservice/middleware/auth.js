const { UnauthorizedError } = require("../src/errors");
const { jwtVerify } = require("../src/utils/jwt"); // ❓ Nếu có file jwt.js
// HOẶC
const jwt = require("jsonwebtoken"); // ❓ Nếu không có file jwt.js

const { getAccessTokenFromHeaders } = require("../src/utils/header");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user"); // ✅ Import User model

const auth = async (req, res, next) => {
  // ✅ Thêm async
  try {
    const { accessToken } = getAccessTokenFromHeaders(req.headers);

    console.log(
      "🔐 Auth middleware - Token:",
      accessToken ? "EXISTS" : "MISSING"
    );

    if (!accessToken) {
      throw new UnauthorizedError("Unauthorized - No token provided");
    }

    // ✅ Verify token
    let decoded;
    if (typeof jwtVerify === "function") {
      // Nếu có utils jwt
      decoded = jwtVerify(accessToken);
    } else {
      // Nếu không có, dùng trực tiếp jwt
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    }

    console.log("✅ Token decoded:", decoded);

    // ✅ Kiểm tra user từ DB (check isBlocked)
    const user = await User.findById(decoded.id).select(
      "isBlocked isAdmin email userName"
    );

    if (!user) {
      throw new UnauthorizedError("Người dùng không tồn tại");
    }

    if (user.isBlocked) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Tài khoản của bạn đã bị khóa",
        blocked: true, // ✅ Flag để client biết
        status: StatusCodes.FORBIDDEN,
      });
    }

    // ✅ FIX: Set req.user với userId
    req.user = {
      userId: decoded.id || decoded.userId, // ✅ Support cả 2 format
      id: decoded.id || decoded.userId, // ✅ Backward compatible
      isBlocked: user.isBlocked, // ✅ Thêm info
      isAdmin: user.isAdmin,
    };

    // ✅ FIX: Set req.userId for backward compatibility
    req.userId = decoded.id || decoded.userId;

    console.log("✅ req.user set:", req.user);
    console.log("✅ req.userId set:", req.userId);

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    if (error instanceof UnauthorizedError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: error.message,
        status: error.statusCode,
      });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized - Invalid token",
      status: StatusCodes.UNAUTHORIZED,
    });
  }
};

module.exports = {
  auth,
};
