const express= require("express");
const app =express();
app.use(express.json()) // to have body to requests specially for post methods
const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')


const userRouter = require('./routes/userRouter')
const clubRouter = require('./routes/clubRouter')
const matchRouter = require('./routes/matchRouter')
const stadiumRouter = require('./routes/stadiumRouter')

 



app.use('/public', express.static('./public'))

app.use('/', userRouter)
app.use('/', clubRouter)
app.use('/', matchRouter)
app.use('/', stadiumRouter)



// Middlewares
// after all handeled routes
app.all('*', (req, res, next) => {
  {res.status(404).json(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));}
})

// handled undefined routes
app.use(errorController)

module.exports = app