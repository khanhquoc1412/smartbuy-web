const { auth } = require('./auth')
const { corsMiddleware } = require('./corsMiddleware')

module.exports = {
    auth,
    corsMiddleware
}