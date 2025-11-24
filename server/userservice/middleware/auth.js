const { UnauthorizedError } = require("../../src/errors");
const { jwtVerify } = require("../../src/utils/jwt"); // ❓ Nếu có file jwt.js
// HOẶC
const jwt = require("jsonwebtoken"); // ❓ Nếu không có file jwt.js

const { getAccessTokenFromHeaders } = require("../../src/utils/header");
const { StatusCodes } = require("http-status-codes");

const auth = (req, res, next) => {
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

    // ✅ FIX: Set req.user với userId
    req.user = {
      userId: decoded.id || decoded.userId, // ✅ Support cả 2 format
      id: decoded.id || decoded.userId, // ✅ Backward compatible
    };

    console.log("✅ req.user set:", req.user);

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
