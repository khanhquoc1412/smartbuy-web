const express = require("express");
const passport = require("passport");
const router = express.Router();

const authValidation = require("../../src/validations/authValidation");
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth"); // Middleware JWT verify

// ========== AUTH ==========

// Đăng ký
router.post("/register", authValidation.register, authController.register);

// Đăng nhập
router.post("/login", authValidation.login, authController.login);

console.log("registerValidation:", authValidation.register);
console.log("authController.register:", authController.register);


// Refresh token
router.post("/refresh-token", authController.refreshToken);

// Lấy profile user theo id (cần login)
router.get("/profile/:id", auth, authController.profile);

// Quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

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

// Optional: Logout (clear token ở frontend, optional ở backend)
router.post("/logout", auth, authController.logout);

module.exports = router;
