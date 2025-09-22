const cors = require('cors')
const { StatusCodes } = require('http-status-codes')

const corsMiddleware = cors({
	origin: ["http://localhost:5173"],
	credentials: true,
	optionsSuccessStatus: StatusCodes.OK
})

module.exports = { corsMiddleware }

