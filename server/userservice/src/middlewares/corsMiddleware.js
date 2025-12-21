const cors = require('cors')
const { StatusCodes } = require('http-status-codes')

const corsMiddleware = cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: StatusCodes.OK
})

module.exports = {
    corsMiddleware
}