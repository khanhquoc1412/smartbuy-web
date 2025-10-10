# 👤 user-service – Quản lý người dùng

## Chức năng

- Đăng ký, đăng nhập, đăng xuất.
- Xác thực JWT.
- Lấy thông tin hồ sơ người dùng.
- Phân quyền (admin, customer).

## Cấu trúc thư mục

userservice/
├── config/
│ ├── config.js
│ ├── connectDB.js
│ └── passport.js
├── controllers/
│ └── auth.controller.js
├── middleware/
│ ├── auth.js
│ ├── cors.js
│ ├── index.js
│ └── multer.js
├── models/
│ ├── address.js
│ └── user.js
├── node_modules/
├── routes/
│ └── auth.router.js
├── services/
│ ├── cloudinary.js
│ ├── index.js
│ └── mailer.js
├── validations/
│ └── authValidation.js
└── .env

## Mô hình MongoDB

```js
const mongoose = require("mongoose");
const { hashPassword } = require("../../src/utils");
// vẫn dùng hàm hashPassword của bạn

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      default: "username",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verifiedDate: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    passwordToken: {
      type: String,
      default: null,
    },
    passwordTokenExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // tự động thêm createdAt & updatedAt
);

// 🔹 Hash password trước khi lưu
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// 🔹 Quan hệ với Cart (1 user có nhiều cart)
UserSchema.virtual("carts", {
  ref: "Cart",
  localField: "_id",
  foreignField: "userId",
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
```
