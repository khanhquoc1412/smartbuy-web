const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError } = require('../../src/errors')
const winston = require('winston')
const validator = require('validator')

const authValidation = {
    login: (req, res, next) => {
        try {
            if (!req.body.email || !req.body.password) {
                throw new BadRequestError("Thông tin không hợp lệ")
            }
            let normalizedEmail =
                req.body.email && validator.normalizeEmail(req.body.email)
            if (normalizedEmail) {
                normalizedEmail = validator.trim(normalizedEmail)
            }

            if (
                !normalizedEmail ||
                !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
            ) {
                throw new BadRequestError("Email không hợp lệ")
            }
            Object.assign(req.body, { email: normalizedEmail })

            return next()
        } catch (error) {
            winston.error(error)
            if (error instanceof BadRequestError) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message,
                    status: error.statusCode
                })
            }
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Lỗi server",
                status: StatusCodes.BAD_REQUEST
            })
        }
    },

    register: (req, res, next) => {
        try {
            if (
                !req.body.email ||
                !req.body.password
            ) {
                throw new BadRequestError('Thông tin không hợp lệ')
            }

            let normalizedEmail =
                req.body.email && validator.normalizeEmail(req.body.email)
            if (normalizedEmail) {
                normalizedEmail = validator.trim(normalizedEmail)
            }

            if (
                !normalizedEmail ||
                !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
            ) {
                throw new BadRequestError('Thông tin không hợp lệ')
            }

            if (!validator.isLength(req.body.password, { min: 6, max: 48 })) {
                throw new BadRequestError('Mật khẩu tối thiểu 6 kí tự')
            }

            Object.assign(req.body, { email: normalizedEmail })

            return next()
        } catch (error) {
            winston.error(error)
            if (error instanceof BadRequestError) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message,
                    status: StatusCodes.BAD_REQUEST
                })
            }
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Lỗi server",
                status: StatusCodes.BAD_REQUEST
            })
        }
    },

}

module.exports = authValidation