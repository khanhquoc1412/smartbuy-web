const express = require("express");
const passport = require("passport");
const router = express.Router();

const authValidation = require("../src/validations/authValidation");
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth"); // Middleware JWT verify

// ========== AUTH ==========

// Đăng ký
router.post("/register", authValidation.register, authController.register);

// Đăng nhập
router.post("/login", authValidation.login, authController.login);

// Verify Email OTP (Registration)
router.post("/verify-email", authController.verifyEmail);

// Verify Login OTP
router.post("/verify-login-otp", authController.verifyLoginOTP);

// Resend OTP (for both registration and login)
router.post("/resend-otp", authController.resendOTP);

console.log("registerValidation:", authValidation.register);
console.log("authController.register:", authController.register);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

// Lấy profile user hiện tại (dùng token)
router.get("/profile", auth, authController.getMe);

// Lấy profile user theo id (cần login)
router.get("/profile/:id", auth, authController.profile);

// Quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-password-otp", authController.verifyForgotPasswordOTP);

// Form reset mật khẩu (GET để hiển thị form)
router.get(
  "/reset-password-form/:userId/:token",
  authController.resetPasswordForm
);

// Đặt lại mật khẩu
router.post("/reset-password/:userId/:token", authController.resetPassword);

// Sau khi login thành công (social hoặc local, dùng POST để nhận token JSON)
router.post("/login-success", authController.loginSuccess);

// ========== GOOGLE AUTH ==========

// Bắt đầu login với Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // Không dùng session, dùng JWT sau
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Giả sử req.user từ Passport (user object sau verify)
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
    // Redirect với user.id, frontend sẽ gọi /login-success để lấy token
    res.redirect(
      `${process.env.CLIENT_URL}/login/login-success/${req.user.id}`
    );
  }
);

// ========== FACEBOOK AUTH ==========

// Bắt đầu login với Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

// Facebook callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
    res.redirect(
      `${process.env.CLIENT_URL}/login/login-success/${req.user.id}`
    );
  }
);

const upload = require("../middleware/upload");

// ... existing code ...

// Optional: Logout (clear token ở frontend, optional ở backend)
router.post("/logout", auth, authController.logout);
router.post("/change-password", auth, authController.changePassword); // ✅ New route
router.post("/upload-avatar", auth, upload.single("avatar"), authController.uploadAvatar);
router.patch("/profile", auth, authController.updateProfile);
router.post("/verify-change-email-otp", auth, authController.verifyChangeEmailOTP);

module.exports = router;
