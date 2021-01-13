const express = require('express')
const router = new express.Router()


const stadiumController = require('../controllers/stadiumController')

router.get('/stadiums', stadiumController.getStadiums)
router.post('/createStadium', stadiumController.createStadium)

module.exports = router