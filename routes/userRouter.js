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
router.get('/me', userController.protect, userController.getMyProfile)
router.put('/me', userController.protect, userController.updateProfile)
router.post('/me/reservations', userController.protect, userController.getMyReservations)
router.put('/me/bookMatch', userController.protect, userController.bookMatch)

module.exports = router