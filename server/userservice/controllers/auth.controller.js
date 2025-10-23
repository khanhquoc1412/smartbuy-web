const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const User = require("../models/user");
// Đúng path
const {
  comparePassword,
  jwtCreate,
  jwtVerify,
  jwtVerifyRefreshToken,
  hashPassword,
} = require("../../src/utils"); // Giả định utils/index.js
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../../src/errors");
const mailer = require("../services/mailer"); // Giả định services/mailer.js

const register = async (req, res) => {
  try {
    const { email, password, userName, confirmPassword } = req.body;

    // Validate confirmPassword
    if (password !== confirmPassword) {
      throw new BadRequestError("Mật khẩu xác nhận không khớp");
    }

    // Check tồn tại
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new ConflictError("Tài khoản đã tồn tại");
    }

    const newUser = await User.create({
      userName,
      email,
      password, // Sẽ auto-hash trong pre-save
    });

    // Gửi email verify nếu cần (tùy chọn)
    // const verifyToken = jwtCreate(newUser._id, { expiresIn: '1d' });
    // mailer(newUser.email, `Verify: http://localhost:3000/api/auth/verify/${verifyToken}`);

    res.status(StatusCodes.CREATED).json({
      message: "Đăng ký thành công",
      status: StatusCodes.CREATED,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ConflictError || error instanceof BadRequestError) {
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
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Tài khoản chưa được đăng ký");
    }
    if (user.isBlocked) {
      throw new UnauthorizedError("Tài khoản bị khóa");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Tài khoản hoặc mật khẩu không chính xác");
    }

    const { accessToken, refreshToken } = jwtCreate(user._id);

    // Update refreshToken
    user.refreshToken = refreshToken;
    await user.save();

    res.status(StatusCodes.OK).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        isBlocked: user.isBlocked,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
      message: ReasonPhrases.OK,
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
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

// const loginSuccess = async (req, res) => {
//   // Cho social login
//   try {
//     const { userId } = req.body; // userId từ params hoặc body sau redirect
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new NotFoundError("Tài khoản chưa được đăng ký");
//     }

//     const { accessToken, refreshToken } = jwtCreate(user._id);

//     // Update refreshToken
//     user.refreshToken = refreshToken;
//     await user.save();

//     res.status(StatusCodes.OK).json({
//       accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         username: user.userName,
//         email: user.email,
//         isBlocked: user.isBlocked,
//         avatarUrl: user.avatarUrl,
//         isVerified: user.isVerified,
//         isAdmin: user.isAdmin,
//       },
//       message: ReasonPhrases.OK,
//       status: StatusCodes.OK,
//     });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof NotFoundError) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         message: error.message,
//         status: error.statusCode,
//       });
//     }
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Lỗi server",
//       status: StatusCodes.BAD_REQUEST,
//     });
//   }
// };
const loginSuccess = async (req, res) => {
  try {
    const { userId } = req.body; // ✅ lấy từ body
    const user = await User.findById(userId); // ✅ lấy từ params// ✅ Passport gắn user vào đây
    if (!user) {
      throw new NotFoundError("Không tìm thấy tài khoản sau khi đăng nhập");
    }

    const { accessToken, refreshToken } = jwtCreate(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(StatusCodes.OK).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        isBlocked: user.isBlocked,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
      message: ReasonPhrases.OK,
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof NotFoundError) {
      return res.status(StatusCodes.NOT_FOUND).json({
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

const profile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -refreshToken"); // Exclude sensitive
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy",
        status: StatusCodes.NOT_FOUND,
      });
    }
    res.status(StatusCodes.OK).json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      isBlocked: user.isBlocked,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new UnauthorizedError("No refresh token provided");
    }

    const decoded = jwtVerifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const tokens = jwtCreate(user._id);
    user.refreshToken = tokens.refreshToken; // ✅ Sửa: dùng tokens.refreshToken
    await user.save();

    res.status(StatusCodes.OK).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: error.message || "Invalid token",
      status: StatusCodes.UNAUTHORIZED,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Cung cấp email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Email chưa được đăng ký");
    }

    // Tạo reset token (dùng JWT, expires 5min)
    const resetToken = jwtCreate(user._id, { expiresIn: "5m" });

    // Lưu token vào DB
    user.passwordToken = resetToken;
    user.passwordTokenExpire = Date.now() + 5 * 60 * 1000; // 5min
    await user.save();

    const resetURL = `http://localhost:8080/reset-password/${user._id}/${resetToken}`; // Frontend URL
    const html = `<h1>Bạn có 5 phút để thay đổi mật khẩu <a href="${resetURL}">Tạo mật khẩu mới</a></h1>`;
    await mailer(email, "Reset Password", html);

    res.status(StatusCodes.OK).json({
      message: "Kiểm tra email của bạn để đặt lại mật khẩu",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
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
};

const resetPasswordForm = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("Không tìm thấy user");
    }

    const decoded = jwtVerify(token);
    if (
      !decoded ||
      user.passwordToken !== token ||
      user.passwordTokenExpire < Date.now()
    ) {
      throw new UnauthorizedError("Liên kết đã hết hạn");
    }

    // Render form (nếu dùng EJS, hoặc redirect frontend)
    res.render("reset-password-form", { userId, token }); // Giả định view engine
  } catch (error) {
    console.log(error);
    if (error instanceof UnauthorizedError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: error.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new BadRequestError("Mật khẩu xác nhận không khớp");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Không tìm thấy user");
    }

    const decoded = jwtVerify(token);
    if (
      !decoded ||
      user.passwordToken !== token ||
      user.passwordTokenExpire < Date.now()
    ) {
      throw new UnauthorizedError("Liên kết đã hết hạn");
    }

    // Update password
    user.password = password; // Auto-hash
    user.passwordToken = undefined;
    user.passwordTokenExpire = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Đổi mật khẩu thành công",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    if (
      error instanceof UnauthorizedError ||
      error instanceof BadRequestError
    ) {
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
};
const logout = async (req, res) => {
  try {
    const { id } = req.user; // giả sử JWT middleware gắn user
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy user",
        status: StatusCodes.NOT_FOUND,
      });
    }

    user.refreshToken = null;
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Đăng xuất thành công",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

module.exports = {
  register,
  login,
  loginSuccess,
  refreshToken,
  profile,
  forgotPassword,
  resetPassword,
  resetPasswordForm,
  logout,
};
