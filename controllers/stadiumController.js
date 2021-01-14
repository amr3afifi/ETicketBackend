const catchAsync = require('./../utils/catchAsync')
const Stadium = require(`./../models/stadiumModel.js`);

  exports.getStadiums = catchAsync(async (req, res, next) => {
    const stadiums = await Stadium.find();
    res.status(200).json({
      status: 'Success', success: true,expireDate: process.env.JWT_EXPIRE_IN,
      data: {stadiums}
    })

  })

  exports.createStadium = catchAsync(async (req, res, next) => {
    const name = req.body.name
    console.log(name)
    const check = await Stadium.findOne({ name })
    if(check==null)
    {
        const newStadium = await Stadium.create({
          name: req.body.name,
          rows: req.body.rows,
          seats: req.body.seats
        })
        
        res.status(200).json({status: 'Success',success: true})
   
    }
    else{ 
      res.status(200).json({statusCode: 401, status: 'fail',name:'Stadium already exists'})
    }
  
  })