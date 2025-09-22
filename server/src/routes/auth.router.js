const express = require("express");
const passport = require("passport");
const router = express.Router();

const authValidation = require("../validations/authValidation");
const authController = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth");

// ========== AUTH ==========

// Đăng ký
router.post("/register", authValidation.register, authController.register);

// Đăng nhập
router.post("/login", authValidation.login, authController.login);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

// Lấy profile user theo id (cần login)
router.get("/profile/:id", auth, authController.profile);

// Quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

// Form reset mật khẩu
router.get(
  "/reset-password-form/:userId/:token",
  authController.resetPasswordForm
);

// Đặt lại mật khẩu
router.post("/reset-password/:userId/:token", authController.resetPassword);

// Sau khi login thành công (social login)
router.post("/login-success", authController.loginSuccess);

// ========== GOOGLE AUTH ==========

// Bắt đầu login với Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google callback
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user) => {
      if (err) return next(err);
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
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
  (req, res, next) => {
    passport.authenticate("facebook", (err, user) => {
      if (err) return next(err);
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(
      `${process.env.CLIENT_URL}/login/login-success/${req.user.id}`
    );
  }
);

module.exports = router;
