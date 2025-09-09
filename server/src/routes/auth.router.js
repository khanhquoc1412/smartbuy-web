const express = require('express')
const passport = require("passport");
const router = express.Router()
const authValidation = require('../validations/authValidation')
const authController = require('../controllers/auth.controller')
const { auth } = require('../middlewares/auth')
router.post(
    '/register',
    authValidation.register,
    authController.register
)
router.post(
    '/login',
    authValidation.login,
    authController.login
)

router.post(
    '/refresh-token',
    authController.refreshToken
)

router.get(
    '/profile/:id',
    auth,
    authController.profile
)

router.get(
    '/reset-password-form/:userId/:token',
    authController.resetPasswordForm
)

router.post(
    '/reset-password/:userId/:token',
    authController.resetPassword
)

router.post(
    '/forgot-password',
    authController.forgotPassword
)

router.post(
    '/login-success',
    authController.loginSuccess
)
// google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}, (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/login/login-success/${req.user.id}`)
}
);

// facebook
router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ["email"],
        session: false
    })
);

router.get('/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}, (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/login/login-success/${req.user.id}`)
}
);
module.exports = router