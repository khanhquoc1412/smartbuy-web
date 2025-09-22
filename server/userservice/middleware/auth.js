const { UnauthorizedError } = require("../../src/errors");
const { jwtVerify } = require("../../src/utils/jwt");
const { getAccessTokenFromHeaders } = require("../../src/utils/header");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/user");

const auth = (req, res, next) => {
  try {
    const { accessToken } = getAccessTokenFromHeaders(req.headers);
    console.log(accessToken);
    if (!accessToken) throw new UnauthorizedError("unauthorized");
    const { id } = jwtVerify(accessToken);
    req.id = id;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof UnauthorizedError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: error.message,
        status: error.statusCode,
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthorized",
      status: StatusCodes.UNAUTHORIZED,
    });
  }
};

const authPermission = async (req, res, next) => {
  try {
    const { accessToken } = getAccessTokenFromHeaders(req.headers);
    console.log(accessToken);
    if (!accessToken) throw new UnauthorizedError("unauthorized");
    const { id } = jwtVerify(accessToken);
    const user = await User.findOne({ where: { email } });
    if (!user.isAdmin) throw new UnauthorizedError("unauthorized");
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: error.message,
        status: error.statusCode,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

module.exports = {
  auth,
  authPermission,
};
