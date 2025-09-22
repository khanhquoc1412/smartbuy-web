const mongoose = require("mongoose");
const config = require("./config")[process.env.NODE_ENV || "development"];

const connectDB = async () => {
	try {
		await mongoose.connect(config.url, config.options);
		console.log("✅ ProductService MongoDB connected successfully.");
	} catch (error) {
		console.error("❌ ProductService MongoDB connection error:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;

