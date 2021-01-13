const express = require('express')
const router = new express.Router()

const matchController = require('../controllers/matchController')

router.get('/matches', matchController.getMatches)
router.delete('/deleteMatch', matchController.deleteMatch)
router.post('/createMatch', matchController.createMatch)
router.put('/editMatch', matchController.editMatch)
router.get('/getMatch', matchController.getMatch)

module.exports = router