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
const { otpTemplate, passwordResetTemplate } = require("../services/emailTemplates");

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
          avatarUrl = `http://localhost:3005/avatars/${randomFile}`;
        }
      }
    } catch (err) {
      console.error("Error selecting default avatar:", err);
    }

    // Tạo user với isVerified = false
    const newUser = await User.create({
      userName,
      email,
      password, // Sẽ auto-hash trong pre-save
      avatarUrl,
      isVerified: false // Chưa verify
    });

    // Generate OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP với thời gian hết hạn 30 phút
    newUser.verificationToken = otp;
    newUser.verificationExpires = Date.now() + 30 * 60 * 1000;
    await newUser.save();

    // Gửi email OTP với template đẹp
    const emailHtml = otpTemplate(userName, otp, 'registration');
    await mailer(email, emailHtml, `Mã xác minh SmartBuy của bạn: ${otp}`);

    console.log(`✅ OTP sent to ${email}: ${otp}`);

    res.status(StatusCodes.OK).json({
      success: true,
      requireOTP: true,
      message: "Vui lòng kiểm tra email để nhập mã OTP",
      email: email
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ConflictError || error instanceof BadRequestError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message,
        status: error.statusCode,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
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

    // Kiểm tra account đã verify chưa
    if (!user.isVerified) {
      throw new UnauthorizedError("Vui lòng xác thực email trước khi đăng nhập");
    }

    if (user.isBlocked) {
      throw new UnauthorizedError("Tài khoản bị khóa");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Tài khoản hoặc mật khẩu không chính xác");
    }

    // Generate OTP cho login
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP với thời gian hết hạn 30 phút
    user.verificationToken = otp;
    user.verificationExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    // Gửi email OTP với template đẹp
    const emailHtml = otpTemplate(user.userName, otp, 'login');
    await mailer(email, emailHtml, `Mã xác minh SmartBuy của bạn: ${otp}`);

    console.log(`✅ Login OTP sent to ${email}: ${otp}`);

    res.status(StatusCodes.OK).json({
      success: true,
      requireOTP: true,
      message: "Vui lòng kiểm tra email để nhập mã OTP",
      email: email
    });
  } catch (error) {
    console.log(error);
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: error.message,
        status: error.statusCode,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
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

// Verify Email OTP (Registration)
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new BadRequestError("Email và mã OTP là bắt buộc");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError(`Không tìm thấy tài khoản: '${email}'`);
    }

    // Kiểm tra: Chỉ verify khi isVerified = false
    if (user.isVerified) {
      throw new BadRequestError("Tài khoản đã được xác thực rồi");
    }

    // Kiểm tra OTP
    if (user.verificationToken !== otp) {
      throw new BadRequestError("Mã OTP không chính xác");
    }

    // Kiểm tra thời gian hết hạn
    if (!user.verificationExpires || Date.now() > user.verificationExpires) {
      throw new BadRequestError("Mã OTP đã hết hạn");
    }

    // ✅ Kích hoạt tài khoản
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    user.verifiedDate = Date.now();

    // Tạo tokens để tự động đăng nhập
    const { accessToken, refreshToken } = jwtCreate(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    console.log(`✅ User verified: ${email}`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Xác thực thành công",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Verify email error:", error);
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError
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

// Verify Login OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new BadRequestError("Email và mã OTP là bắt buộc");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Không tìm thấy tài khoản");
    }

    // Kiểm tra: Chỉ verify login khi isVerified = true
    if (!user.isVerified) {
      throw new UnauthorizedError("Tài khoản chưa được kích hoạt");
    }

    // Kiểm tra OTP
    if (user.verificationToken !== otp) {
      throw new BadRequestError("Mã OTP không chính xác");
    }

    // Kiểm tra thời gian hết hạn
    if (!user.verificationExpires || Date.now() > user.verificationExpires) {
      throw new BadRequestError("Mã OTP đã hết hạn");
    }

    // ✅ Cấp tokens
    const { accessToken, refreshToken } = jwtCreate(user._id);

    user.refreshToken = refreshToken;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    console.log(`✅ User logged in: ${email}`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("❌ Verify login OTP error:", error);
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError ||
      error instanceof UnauthorizedError
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

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body; // type: 'registration' | 'login'

    if (!email || !type) {
      throw new BadRequestError("Email và type là bắt buộc");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Không tìm thấy tài khoản");
    }

    // Kiểm tra type hợp lệ
    if (type === 'registration' && user.isVerified) {
      throw new BadRequestError("Tài khoản đã được verify rồi");
    }
    if (type === 'login' && !user.isVerified) {
      throw new BadRequestError("Vui lòng verify email trước");
    }

    // Generate OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationToken = otp;
    user.verificationExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Gửi email OTP với template đẹp
    const emailHtml = otpTemplate(user.userName, otp, type);
    const title = `Mã xác minh SmartBuy của bạn: ${otp}`;
    await mailer(email, emailHtml, title);

    console.log(`✅ OTP resent to ${email}: ${otp}`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Đã gửi lại mã OTP, vui lòng kiểm tra email",
    });
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError
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
  verifyEmail,
  verifyLoginOTP,
  resendOTP,
};
