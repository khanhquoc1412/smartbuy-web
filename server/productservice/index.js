require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/connectDB");
const { corsMiddleware } = require("./src/middleware");

const app = express();
const PORT = process.env.PRODUCT_PORT || process.env.PORT || 3006;

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRouter = require("./src/routes/product.router");
app.use("/api/product", productRouter);

connectDB();

app.listen(PORT, () => {
	console.log(`Product Service running on port ${PORT}`);
});

module.exports = app;

