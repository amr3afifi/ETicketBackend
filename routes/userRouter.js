const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/getActiveUsers', userController.getActiveUsers)
router.get('/getInActiveUsers', userController.getInactiveUsers)
router.put('/deleteUser', userController.deleteUser)
router.put('/approveUser', userController.approveUser)
router.put('/declineUser', userController.declineUser)
router.post('/signUp', userController.signUp)
router.post('/signIn', userController.signIn)
router.post('/me', userController.getMyProfile)
router.put('/me', userController.updateProfile)
router.post('/me/reservations', userController.getMyReservations)
router.put('/me/bookMatch', userController.bookMatch)

module.exports = router