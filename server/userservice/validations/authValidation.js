const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../errors");
const winston = require("winston");
const validator = require("validator");

const authValidation = {
  login: (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) {
        throw new BadRequestError("Thông tin không hợp lệ");
      }

      if (!req.body.email || !validator.isEmail(req.body.email)) {
        throw new BadRequestError("Email không hợp lệ");
      }

      return next();
    } catch (error) {
      winston.error(error);
      if (error instanceof BadRequestError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
          status: error.statusCode,
        });
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi server",
        status: StatusCodes.BAD_REQUEST,
      });
    }
  },

  register: (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) {
        throw new BadRequestError("Thông tin không hợp lệ");
      }

      if (!req.body.email || !validator.isEmail(req.body.email)) {
        throw new BadRequestError("Thông tin không hợp lệ");
      }

      if (!validator.isLength(req.body.password, { min: 6, max: 48 })) {
        throw new BadRequestError("Mật khẩu tối thiểu 6 kí tự");
      }

      return next();
    } catch (error) {
      winston.error(error);
      if (error instanceof BadRequestError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
          status: StatusCodes.BAD_REQUEST,
        });
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi server",
        status: StatusCodes.BAD_REQUEST,
      });
    }
  },
};

module.exports = authValidation;
