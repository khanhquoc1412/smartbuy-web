const { Router } = require('express')
const brandController = require('../controllers/brand.controller')
const router = Router()

router.get('/list', brandController.getAll)

module.exports = router