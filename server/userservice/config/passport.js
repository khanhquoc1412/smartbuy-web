require("dotenv").config();
const passport = require("passport");
const User = require("../models/user");
// models/User.js phải là mongoose model
const { createCryptoString } = require("../src/utils/cryptoString");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

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

        // Nếu không có email => reject
        if (!email) {
          return cb(new Error("Google không cung cấp email"));
        }

        let user = await User.findOne({ email });

        // Nếu chưa có thì tạo mới
        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email,
            password: createCryptoString(),
            isVerified: true, // Login social coi như verified
            name: profile.displayName,
            verifiedDate: new Date(),
            avatarUrl: profile.photos?.[0]?.value || null,
            provider: "google",
            providerId: profile.id,
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

        if (!email) {
          return cb(new Error("Facebook không cung cấp email"));
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email,
            password: createCryptoString(),
            isVerified: true,
            name: profile.displayName,
            verifiedDate: new Date(),
            avatarUrl: profile.photos?.[0]?.value || null,
            provider: "facebook",
            providerId: profile.id,
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
