/** Express controller providing user related controls
 * @module controllers/user
 * @requires express
 */

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * AppError class file
 * @const
 */
const AppError = require('./../utils/appError')

// Handling which module to export
const userController = {}

// Functions needed for production only
userController.prodExports = {
  requestResetPassword: requestResetPassword,
  resetPassword: resetPassword,
  requestBecomePremium: requestBecomePremium,
  requestBecomeArtist: requestBecomeArtist,
  confirmUpgrade: confirmUpgrade,
  cancelUpgrade: cancelUpgrade,
  confirmCancelUpgrade: confirmCancelUpgrade,
  updateNotificationsToken: updateNotificationsToken,
  getNotifications: getNotifications
}

const exported = userController.prodExports
module.exports = exported
