require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const { hashPassword } = require("../src/utils");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/userservice";

const users = [
  {
    userName: "admin",
    email: "admin@smartbuy.com",
    password: "admin123",
    isAdmin: true,
    isVerified: true,
  },
  {
    userName: "user1",
    email: "user1@smartbuy.com",
    password: "user12345",
    isAdmin: false,
    isVerified: true,
  },
  {
    userName: "user2",
    email: "user2@smartbuy.com",
    password: "user23456",
    isAdmin: false,
    isVerified: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    console.log("Cleared User collection");

    for (let user of users) {
      const hashed = await hashPassword(user.password);
      user.password = hashed;
      await User.create(user);
      console.log(`Created user: ${user.email}`);
    }

    console.log("Seeding done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
