/** Express router providing user related routes
 * @module routes/users
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router()

// /**
//  * User controller to call when routing.
//  * @type {object}
//  * @const
//  */
//const userController = require('../controllers/userController')

/**
 * Auth controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('../controllers/authController')


/**
 * Route for requesting to sign up
 * @name post/signUp
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Sign up path
 * @param {callback} middleware - Sign up middleware.
 */
router.post('/signUp', authController.signUp)

/**
* Route for requesting to sign in
* @name post/signIn
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - Sign in path
* @param {callback} middleware - Sign in middleware.
*/
router.post('/signIn', authController.signIn)

/**
* Route for requesting to get user profile
* @name get/getUserProfile
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - get user profile path
* @param {callback} middleware - get user profile middleware.
*/
router.get('/users/:id', authController.getUserProfile)

/**
* Route for requesting to get my profile
* @name get/getMyProfile
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - get my profile path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - get my profile middleware.
*/
router.get('/me', authController.protect, authController.getMyProfile)

/**
* Route for requesting to update user profile
* @name put/updateProfile
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - update profile path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - update profile middleware.
*/
router.put('/me', authController.protect, authController.updateProfile)

module.exports = router