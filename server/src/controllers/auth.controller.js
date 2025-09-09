const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { User } = require('../database/models')
const { comparePassword, jwtCreate, jwtVerify, hashPassword } = require('../utils')
const { jwtDecodeToken } = require('../utils/jwt')
const { NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError } = require('../errors')
const mailer = require('../services/mailer')


const register = async (req, res) => {
    try {
        const { email, password, userName } = req.body;

        const isUserExist = await User.findOne({ where: { email } });
        if (isUserExist) {
            throw new ConflictError('Tài khoản đã tồn tại')
        }
        const newUser = {
            password,
            email,
            userName
        };
        await User.create(newUser);
        res.status(StatusCodes.CREATED).json({
            message: "Đăng ký thành công",
            status: StatusCodes.CREATED,
        });
    } catch (error) {
        console.log(error)
        if (error instanceof ConflictError) {
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
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundError('Tài khoản chưa được đăng ký')
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError('Tài khoản hoặc mật khẩu không chính xác')
        }

        const { accessToken, refreshToken } = jwtCreate(user.id)

        //Tìm và sửa refreshToken
        await User.update({ refreshToken: refreshToken }, { where: { email } })

        return res.status(StatusCodes.OK).json({
            accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                username: user.userName,
                email: user.email,
                isBlocked: user.isBlocked,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                isAdmin: user.isAdmin
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK
        })
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: error.message,
                status: error.statusCode
            })
        }
        if (error instanceof UnauthorizedError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }

}
const loginSuccess = async (req, res) => {
    try {
        console.log("Đã vào")
        const { userId: id } = req.body;
        const user = await User.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundError('Tài khoản chưa được đăng ký')
        }

        const { accessToken, refreshToken } = jwtCreate(user.id)

        //Tìm và sửa refreshToken
        await User.update({ refreshToken: refreshToken }, { where: { id } })

        return res.status(StatusCodes.OK).json({
            accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                username: user.userName,
                email: user.email,
                isBlocked: user.isBlocked,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                isAdmin: user.isAdmin
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK
        })
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: error.message,
                status: error.statusCode
            })
        }
        if (error instanceof UnauthorizedError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }

}

const refreshToken = async (req, res) => {
    try {
        const authorization = (req.headers.authorization ||
            req.headers.Authorization)
        if (!authorization) {
            throw new NotFoundError('Không xác thực')
        }
        const accessTokenFromHeader = authorization.split(' ')[1]

        if (!accessTokenFromHeader) {
            throw new NotFoundError('Không xác thực')
        }
        const decoded = jwtDecodeToken(accessTokenFromHeader);
        if (!decoded) {
            throw new ConflictError('AccessToken không hợp lệ')
        }
        const { refreshToken, userId } = req.body;

        if (!refreshToken) {
            throw new NotFoundError('Không tìm thấy RefreshToken')
        }
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            throw new NotFoundError('Không tìm thấy user')
        }
        if (user.refreshToken !== refreshToken) {
            throw new ConflictError('RefreshToken không hợp lệ')
        }
        const { accessToken } = jwtCreate(user.id)
        return res.status(StatusCodes.CREATED).json({
            message: "Successfully",
            status: StatusCodes.CREATED,
            accessToken
        })

    } catch (error) {
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
}
const profile = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy",
                status: StatusCodes.NOT_FOUND
            })
        }
        return res.status(StatusCodes.OK).json({
            id: user.id,
            userName: user.userName,
            email: user.email,
            isBlocked: user.isBlocked,
            avatarUrl: user.avatarUrl,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        if (!email) {
            throw new NotFoundError("Cung cấp tài khoản email")
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw new NotFoundError("Email chưa được đăng ký")
        }
        const { resetPasswordToken } = jwtCreate(user.id)

        const resetURL = `<h1>Ban co 5phut de thay doi mat khau <a href="http://localhost:3000/api/auth/reset-password/${user.id}/${refreshToken}">Tao mat khau moi</a></h1>`
        mailer(email, resetURL)
        console.log(user.id)
        console.log(resetPasswordToken)

        res.status(StatusCodes.OK).json({
            message: "Kiểm tra email của bạn để đặt lại mật khẩu",
            status: StatusCodes.OK
        })
    } catch (error) {
        console.log(error)
        if (error instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}
const resetPassword = async (req, res, next) => {
    try {
        const { userId, token } = req.params
        console.log(userId, token)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new NotFoundError("Không tìm thấy user")
        }

        const data = jwtVerify(token)
        if (!data) {
            throw new UnauthorizedError("Liên kết đã hết hạn")
        }

        const { password } = await req.body
        user.password = await hashPassword(password)
        console.log(password)
        const saveNewPassword = await user.save()

        res.status(StatusCodes.OK).json({
            message: "Đổi mk thành công",
            status: StatusCodes.OK
        })
    } catch (error) {
        console.log(error)
        if (error instanceof UnauthorizedError) {
            return res.render('error')
        }
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "Đổi mật khẩu không thành công"
        })
    }
}

const resetPasswordForm = async (req, res, next) => {
    try {
        const { userId, token } = req.params
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new BadRequestError("Không tìm thấy user")
        }

        const data = jwtVerify(token)
        if (!data) {
            throw new UnauthorizedError("Liên kết đã hết hạn")
        }
        res.render("index", { userId, token })
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return res.render('error')
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

module.exports = {
    register,
    login,
    loginSuccess,
    refreshToken,
    profile,
    resetPassword,
    resetPasswordForm,
    forgotPassword
}