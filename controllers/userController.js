
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { promisify } = require('util')
const Match = require('../models/matchModel')

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

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
}

exports.signUp = catchAsync(async (req, res, next) => {
  // create a new user with the input data
  const email = req.body.email
  const username = req.body.username
  const checkMail = await User.findOne({ email })
  const checkUsername = await User.findOne({ username })

  if(checkMail==null)
  {
    if(checkUsername==null)
    {
      // const newUser = await User.create({
      //   email: req.body.email,
      //   password: req.body.password,
      //   username: req.body.username,
      //   first: req.body.first,
      //   last: req.body.last,
      //   role: req.body.role,
      //   address: req.body.address,
      //   city: req.body.city,
      //   dateOfBirth: req.body.dateOfBirth,
      //   gender: req.body.gender,
      //   active: false
      // })

      var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        first: req.body.first,
        last: req.body.last,
        role: req.body.role,
        address: req.body.address,
        city: req.body.city,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        active: false
    });

    if(newUser.role=='admin')
    {newUser.active=true;}

    newUser.save(err => {console.log(err)});
      
      // generate a token for the new user
      const token = signToken(newUser._id)
      res.status(200).json({status: 'Success',success: true,expireDate: process.env.JWT_EXPIRE_IN,token})
  }
  else
  {res.status(200).json(new AppError('Username is already taken !', 402));}

  }
  else{ res.status(200).json(new AppError('Email is already registered !', 401));}

})

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // check if email and password exist
  if (!email || !password)
  {res.status(401).json(new AppError('Please provide email or password!', 400));}

  // check if email and password are correct
  const tempUser = await User.findOne({ email }).select('+password')
  if (!tempUser) 
  {res.status(200).json(new AppError('Incorrect email!', 401));}

  const correct = await tempUser.correctPassword(password, tempUser.password)
  if (!correct) 
  {res.status(200).json(new AppError('Incorrect password!', 402));}
  else
  {
    if(tempUser.active)
    {
      // generate and send token
    const token = signToken(tempUser._id)
    res.status(200).json({status: 'Success', success: true, expireDate: process.env.JWT_EXPIRE_IN,token,role:tempUser.role})
    }
    else
    res.status(200).json(new AppError('Admin did not activate user yet!', 402));
  }

})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if the user role has a permission to a certain action
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}

//! CHECK REQ.USER.ID
exports.getMyProfile = catchAsync(async (req, res, next) => {
  // get the user from database and send his data
  const newUser = await User.findById(req.user.id)
if(newUser!=null){
  res.status(200).json({
    username: newUser.username,
    email: newUser.email,
    gender: newUser.gender,
    dateOfBirth: newUser.dateOfBirth,
    role: newUser.role,
    first: newUser.first,
    last: newUser.last,
    address: newUser.address,
    city: newUser.city,
  })}
  else{res.status(401).json(new AppError('User not found!', 401));}
})
//! CHECK REQ.USER.ID
exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if(req.body.first!='' && req.body.first!=null)
    {user.first = req.body.first}

  if(req.body.last!='' && req.body.last!=null)
  {user.last = req.body.last}
  
  if(req.body.gender!='' && req.body.gender!=null)
  {user.gender = req.body.gender}

  if(req.body.dateOfBirth!='' && req.body.dateOfBirth!=null)
  {user.dateOfBirth = req.body.dateOfBirth}
 
  if(req.body.address!='' && req.body.address!=null)
  {user.address = req.body.address}

  if(req.body.city!='' && req.body.city!=null)
  {user.city = req.body.city}

  await user.save()

  res.status(200).json({status: 'Success',success:true})

})

exports.getInactiveUsers= catchAsync(async (req, res, next) => {
  const users = await User.find({active: { $eq: false }});
  res.status(200).json({status: 'Success', success: true, data: {users}})
})

exports.getActiveUsers= catchAsync(async (req, res, next) => {
  const users = await User.find({active: { $eq: true }});
  res.status(200).json({status: 'Success', success: true, data: {users}})
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const user= await User.findByIdAndDelete(req.body.id)
  if(user!=null)
  {res.status(200).json({status: 'Success', success: true})}
  else{res.status(200).json(new AppError('User not found!', 401));}
})

exports.declineUser = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const user= await User.findByIdAndDelete(req.body.id)
  if(user!=null)
  {res.status(200).json({status: 'Success', success: true})}
  else{res.status(200).json(new AppError('User not found!', 401));}
  
})

exports.approveUser = catchAsync(async (req, res, next) => {
  const user=  await User.findOne({ _id: req.body.id},err => {console.log(err)});
  if(user!=null)
  {
    if(user.active==false)
    {
    user.active=true;
    await user.save(err => {console.log(err)});
    res.status(200).json({status: 'Success', success: true})
    }
    else{res.status(200).json(new AppError('User already active!', 401));}
  }
  else{res.status(200).json(new AppError('User not found!', 401));}
})

//! CHECK REQ.USER.ID
exports.getMyReservations= catchAsync(async (req, res, next) => {
  const newUser = await User.findById(req.user.id)
if(newUser!=null)
{
  hobaa=newUser.reservedMatches;
  res.status(200).json({status: 'Success', success: true, data: {hobaa}});

}
  else{res.status(401).json(new AppError('User not found!', 401));}
})

//! CHECK REQ.USER.ID
exports.bookMatch= catchAsync(async (req, res, next) => {
const newUser = await User.findOne({ _id: req.user.id},err => {console.log(err)});
const match = await Match.findOne({ _id: req.body.matchid},err => {console.log(err)});
matchToReserve=[];
if(newUser!=null)
{
  if(match!=null)
  {
    seatsArray=match.seats;
    seatsToReserve=req.body.seats;

    seatsToReserve.forEach(function (arrayItem) 
    {seatsArray[arrayItem]=1;});

    match.seats=seatsArray;
    await match.save(err => {console.log(err)});

    let hoba={matchid: req.body.matchid ,seats: req.body.seats,date:req.body.date}
    newUser.reservedMatches.push(hoba)
    await newUser.save(err => {console.log(err)});
    res.status(200).json({status: 'Success', success: true});
  }
  else
  {res.status(401).json(new AppError('Match not found!', 401));}
}
  else{res.status(401).json(new AppError('User not found!', 401));}
})