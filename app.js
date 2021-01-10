const express= require("express");
const app =express();
app.use(express.json()) // to have body to requests specially for post methods
const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')


const userRouter = require('./routes/userRouter')


 



app.use('/public', express.static('./public'))

app.use('/', userRouter)



// Middlewares
// after all handeled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// handled undefined routes
app.use(errorController)

module.exports = app