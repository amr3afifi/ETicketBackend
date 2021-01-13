const catchAsync = require('./../utils/catchAsync')
const Club = require(`./../models/clubModel.js`);

exports.getClubs = catchAsync(async (req, res, next) => {
    const clubs = await Club.find();
    res.status(200).json({status: 'Success', success: true,data: {clubs}})
})