const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 404)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleMongoError = err => new AppError('Input data must be unique', 400)

const handleJWTError = err => new AppError('Invalid token. Please log in again', 401)

const handleJWTExpiredError = err => new AppError('Your token has expired. Please log in again', 401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => { //    Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    // console.error('ERROR ', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
      return sendErrorProd(error, res)
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error)
      return sendErrorProd(error, res)
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError(error)
      return sendErrorProd(error, res)
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error)
      return sendErrorProd(error, res)
    }
    if (error.name === 'MongoError') {
      error = handleMongoError(error)
      return sendErrorProd(error, res)
    }

    return sendErrorProd(err, res)
  }
}
