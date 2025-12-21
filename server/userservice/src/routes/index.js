const authRouter = require("./auth.router")
const productRouter = require('./product.router')
const cartRouter = require('./cart.router')
const brandRouter = require('./brand.router')
const orderRouter = require('./order.router')


const createRouter = (app) => {
    app.use("/api/auth", authRouter)
    app.use("/api/product", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/brand", brandRouter)
    app.use("/api/orders", orderRouter)
    app.use("/api", authRouter)
    app.use("/", authRouter)
}

module.exports = createRouter