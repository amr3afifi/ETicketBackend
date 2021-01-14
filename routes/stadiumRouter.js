const express = require('express')
const router = new express.Router()


const stadiumController = require('../controllers/stadiumController')

router.get('/stadiums', stadiumController.getStadiums)
router.post('/createStadium', stadiumController.createStadium)
router.put('/getStadium', stadiumController.getStadium)

module.exports = router