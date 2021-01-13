const express = require('express')
const router = new express.Router()

const clubController = require('../controllers/clubController')

router.get('/clubs', clubController.getClubs)

module.exports = router
