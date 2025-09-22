require("dotenv").config();
const passport = require("passport");
const User = require("../models/user");
// models/User.js phải là mongoose model
const { createCryptoString } = require("../../src/utils/cryptoString");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_GOOGLE_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email,
            password: createCryptoString(),
            isVerified: profile.emails?.[0]?.verified || false,
            name: profile.displayName,
            verifiedDate: new Date(),
            avatarUrl: profile.photos?.[0]?.value || null,
          });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.CALLBACK_FACEBOOK_URL,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email,
            password: createCryptoString(),
            isVerified: false,
            name: profile.displayName,
            verifiedDate: new Date(),
            avatarUrl: profile.photos?.[0]?.value || null,
          });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
