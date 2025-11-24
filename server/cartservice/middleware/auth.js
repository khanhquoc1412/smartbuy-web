const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const config = require("../config/config");

/**
 * Authentication Middleware
 * Verify JWT token and attach user to request
 */
module.exports = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    // Verify token with ACCESS_TOKEN_PRIVATE_KEY (same as userservice)
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY);

    // Attach user to request
    req.user = {
      _id: decoded._id || decoded.id || decoded.userId,
      id: decoded._id || decoded.id || decoded.userId,
      email: decoded.email,
      userName: decoded.userName || decoded.username,
      role: decoded.role,
    };

    console.log("✅ Auth successful:", {
      userId: req.user._id,
      userName: req.user.userName,
      path: req.path,
    });

    next();
  } catch (error) {
    console.error("❌ Auth error:", {
      error: error.message,
      name: error.name,
      path: req.path,
    });

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token đã hết hạn, vui lòng đăng nhập lại",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token không hợp lệ",
        code: "INVALID_TOKEN",
      });
    }

    if (error.name === "NotBeforeError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token chưa có hiệu lực",
        code: "TOKEN_NOT_ACTIVE",
      });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Xác thực thất bại",
      code: "AUTH_FAILED",
    });
  }
};
