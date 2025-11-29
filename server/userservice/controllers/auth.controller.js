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

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // ✅ Validate required fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new BadRequestError("Thiếu thông tin");
    }

    // ✅ Validate new passwords match
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError("Mật khẩu mới không khớp");
    }

    // ✅ Validate password length
    if (newPassword.length < 6) {
      throw new BadRequestError("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // ✅ Check if new password is different from current
    if (currentPassword === newPassword) {
      throw new BadRequestError("Mật khẩu mới phải khác mật khẩu hiện tại");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Không tìm thấy người dùng");
    }

    // ✅ Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Mật khẩu hiện tại không đúng");
    }

    // ✅ Update password (will auto-hash in pre-save hook)
    user.password = newPassword;

    // ✅ Optional: Clear refresh token (force re-login on other devices)
    // user.refreshToken = null;

    await user.save();

    console.log("✅ Password changed for user:", user.email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Đổi mật khẩu thành công",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("❌ Change password error:", error);
    if (
      error instanceof UnauthorizedError ||
      error instanceof BadRequestError ||
      error instanceof NotFoundError
    ) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        status: error.statusCode,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lỗi server",
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../services/cloudinary');

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

    // Random default avatar
    let avatarUrl = null;
    try {
      const avatarDir = path.join(__dirname, '../avarta');
      if (fs.existsSync(avatarDir)) {
        const files = fs.readdirSync(avatarDir);
        if (files.length > 0) {
          const randomFile = files[Math.floor(Math.random() * files.length)];
          // Assuming server runs on port 3005 locally
          avatarUrl = `http://localhost:3005/avatars/${randomFile}`;
        }
      }
    } catch (err) {
      console.error("Error selecting default avatar:", err);
    }

    const newUser = await User.create({
      userName,
      email,
      password, // Sẽ auto-hash trong pre-save
      avatarUrl // Set default avatar
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
        avatarUrl: newUser.avatarUrl
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

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Local Storage Implementation
    const avatarDir = path.join(__dirname, '../avarta');
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    const fileExt = path.extname(req.file.originalname) || '.jpg';
    const filename = `avatar-${userId}-${Date.now()}${fileExt}`;
    const filePath = path.join(avatarDir, filename);

    // Write buffer to file
    fs.writeFileSync(filePath, req.file.buffer);

    // Construct URL (Assuming server runs on port 3005)
    // In production, use process.env.BASE_URL or similar
    const baseUrl = process.env.BASE_URL || 'http://localhost:3005';
    const avatarUrl = `${baseUrl}/avatars/${filename}`;

    // Update user avatar
    user.avatarUrl = avatarUrl;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl: user.avatarUrl
    });

  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || "Upload failed"
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

      refreshToken: user.refreshToken,
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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (userName) user.userName = userName;
    if (email) user.email = email;

    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || "Update failed"
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
  changePassword,
  uploadAvatar,
  updateProfile,
};
