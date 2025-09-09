const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const { corsMiddleware } = require('./middlewares')
const cookieParser = require('cookie-parser')
const createRouter = require('./routes')
const connectDB = require("./database/config/connectDB");
require("./database/config/passport");

app.use(corsMiddleware)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

createRouter(app)
const port = process.env.WEB_PORT || 5000
const startServer = async (app, port) => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`app listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};
startServer(app, port);