/** Express controller providing auth related controls
 * @module controllers/auth
 * @requires express
 */

/**
 * Auth controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * util to import promisify function
 * @const
 */
const { promisify } = require('util')

/**
 * user object
 * @const
 */
const User = require('../models/userModel')

/**
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * catch async for async functions
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * error object
 * @const
 */
const AppError = require('../utils/appError')


// generating token using user id
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
}

/**
* A function for signing up users
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signUp = catchAsync(async (req, res, next) => {
  // create a new user with the input data
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    first: req.body.first,
    last: req.body.last,
    role: req.body.role,
    address: req.body.address,
    city: req.body.city,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender
  })
  console.log(newUser)
  // generate a token for the new user
  const token = signToken(newUser._id)
  console.log(token)
  res.status(200).json({
    status: 'Success',
    success: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A function for signing in users
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
console.log(req.body)
  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email or password!', 400))
  }

  // check if email and password are correct
  const tempUser = await User.findOne({ email }).select('+password')
  if (!tempUser) {
    return next(new AppError('Incorrect email!', 401))
  }
  const correct = await tempUser.correctPassword(password, tempUser.password)
  console.log(correct)
  if (!correct) {
    console.log('yalaaa')
    // res.status(401).json({
    //   status: 'Error',
    //   success: false,
    // })
    v=new AppError('Incorrect password!', 401);
    res.status(401).json(v);
    // return new AppError('Incorrect password!', 401)
  }

  
if(correct){
  // generate and send token
  const token = signToken(tempUser._id)

  res.status(200).json({
    status: 'Success',
    success: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
}

})

/**
* A middleware function for token validation and verification
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.protect = catchAsync(async (req, res, next) => {
  let token

  // get token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401))
  }

  // verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET) // error handling

  // check if user still exists
  const freshUser = await User.findById(decoded.id)
  if (!freshUser) {
    return next(new AppError('The user belonging to this token does no longer exists', 401))
  }

  req.user = freshUser
  next()
})

/**
* A function that pass roles to a middleware function to check for authorization
* @alias module:controllers/auth
* @param {array} roles - The function takes the request as a parameter to access its body.
*/
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if the user role has a permission to a certain action
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}

/**
* A function to get my profile
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getMyProfile = catchAsync(async (req, res, next) => {
  // get the user from database and send his data
  const newUser = await User.findById(req.user.id)

  res.status(200).json({
    name: newUser.name,
    email: newUser.email,
    gender: newUser.gender,
    dateOfBirth: newUser.dateOfBirth,
    images: newUser.images,
    followers: newUser.followers,
    following: newUser.following,
    uri: newUser.uri,
    href: newUser.href,
    userStats: newUser.userStats,
    artistInfo: newUser.artistInfo,
    role: newUser.role
  })
})

/**
* A function to get user profile
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getUserProfile = catchAsync(async (req, res, next) => {
  // get the user from database and send his data
  const newUser = await User.findById(req.params.id)

  if (!newUser) {
    return next(new AppError('Please enter a valid id', 400))
  }

  res.status(200).json({
    name: newUser.name,
    email: newUser.email,
    gender: newUser.gender,
    dateOfBirth: newUser.dateOfBirth,
    images: newUser.images,
    followers: newUser.followers,
    following: newUser.following,
    uri: newUser.uri,
    href: newUser.href,
    userStats: newUser.userStats,
    artistInfo: newUser.artistInfo,
    role: newUser.role
  })
})

/**
* A function to update user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.updateProfile = catchAsync(async (req, res, next) => {
  // get user from database
  const user = await User.findById(req.user.id)

  // update the user data with the new data and send the updated user
  user.email = req.body.email
  user.name = req.body.name
  user.gender = req.body.gender
  user.dateOfBirth = req.body.dateOfBirth
  await user.save()

  res.status(200).json({
    status: 'Success',
    user
  })
})

