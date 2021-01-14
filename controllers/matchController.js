const Stadium = require('./../models/stadiumModel');
const Match = require(`./../models/matchModel.js`);
const catchAsync = require('../utils/catchAsync')


//GET ALL MATCHES:
exports.getMatches = catchAsync(async (req, res, next) => {
const matches = await Match.find();
res.status(200).json({status: 'Success', success: true,data: {matches}})
})

exports.deleteMatch = catchAsync(async (req, res, next) => {
    const user= await Match.findByIdAndDelete(req.body.id)
  if(user!=null)
  {res.status(200).json({status: 'Success', success: true})}
  else{res.status(200).json(new AppError('Match not found!', 401));}
  
})

exports.createMatch = catchAsync(async (req, res, next) => {
    const team1 = req.body.team1
    const team2 = req.body.team2
    const stadium = req.body.stadium
    const date = req.body.date
    const time = req.body.time
    const refree= req.body.refree
    const lineman1= req.body.lineman1
    const lineman2= req.body.lineman2

    let valid=true;
    const matches1 = await Match.find({ team1 })
    const matches2 = await Match.find({ team2 })
    const stadiumCheck = await Match.find({ stadium })
    
    if(date<=new Date())
    {res.status(200).json({statusCode: 401, status: 'fail',name:'Cannot create a match with a past date or on the same day '});}
  

    matches1.forEach(function (arrayItem) 
    {
        if(arrayItem.date == date)
        {
            valid=false;
            res.status(200).json({statusCode: 401, status: 'fail',name:'Team 1 cannot have 2 matches on the same day'});
        }
    });

    if(valid==true)
    {
        matches2.forEach(function (arrayItem) {
            if(arrayItem.date == date)
            {
                valid=false;
                res.status(200).json({statusCode: 401, status: 'fail',name:'Team 2 cannot have 2 matches on the same day'});
            }
        });
    }

    if(valid==true)
    {
        stadiumCheck.forEach(function (arrayItem) 
        {
            if(arrayItem.date == date)
            {
                valid=false;
                res.status(200).json({statusCode: 401, status: 'fail',name:'Cannot have 2 matches on the same stadium on the same time '});
            }
        });
    }

    if(valid==true)
    {
        const seatsrc = await Stadium.findOne({"name" : {$regex : ".*"+stadium+".*"}});
        let seatsStad=new Array(Number(seatsrc.rows) *Number(seatsrc.seats)).fill(0);

        var m = new Match({
            team1: req.body.team1,
            team2: req.body.team2,
            stadium: req.body.stadium,
            date: req.body.date,
            time: req.body.time,
            refree: req.body.refree,
            lineman1: req.body.lineman1,
            lineman2: req.body.lineman2,
            seats: seatsStad
        });
        m.save(err => {console.log(err)});
        res.status(200).json({status: 'Success',success: true}) 
    }
    res.status(401).json({statusCode: 401, status: 'fail',name:'Cannot have 2 matches on the same stadium on the same time '});
});

exports.editMatch = catchAsync(async (req, res, next) => {
const match= await  Match.findOne({ _id: req.body.id},err => {console.log(err)});
if(match!=null)
{
  change=false;
  if(req.body.team1!='' && req.body.team1!=null)
    {
        const team1=req.body.team1;
        const matches1 = await Match.find({ team1 });
        matches1.forEach(function (arrayItem) 
        {
            if(arrayItem.date == date)
            {
                res.status(401).json({statusCode: 401, status: 'fail',name:'Team 1 cannot have 2 matches on the same day'});
            }
        }); 
        match.team1=req.body.team1;change=true;}

  if(req.body.team2!='' && req.body.team2!=null)
  {   const team2=req.body.team2;
      const matches2 = await Match.find({ team2 });
      matches2.forEach(function (arrayItem) 
        {
            if(arrayItem.date == date)
            {
                res.status(401).json({statusCode: 401, status: 'fail',name:'Team 2 cannot have 2 matches on the same day'});
            }
        }); 
       match.team2=req.body.team2;change=true;}
  
  if(req.body.refree!='' && req.body.refree!=null)
  {match.refree=req.body.refree;change=true;}

  if(req.body.date!='' && req.body.date!=null && req.body.date>new Date())
  {
      if(new Date(req.body.date)<=new Date())
    {res.status(401).json({statusCode: 401, status: 'fail',name:'Cannot create a match with a past date or on the same day '});}
  
    match.date=req.body.date;change=true;}
 
  if(req.body.lineman1!='' && req.body.lineman1!=null)
  {match.lineman1=req.body.lineman1;change=true;}

  if(req.body.lineman2!='' && req.body.lineman2!=null)
  {match.lineman2=req.body.lineman2;change=true;}

  if(req.body.stadium!='' && req.body.stadium!=null)
  {  
      const stadium=req.body.stadium;
      const stadiumCheck = await Match.find({ stadium });
      stadiumCheck.forEach(function (arrayItem) 
        {
            if(arrayItem.date == date)
            {
                res.status(401).json({statusCode: 401, status: 'fail',name:'Stadium cannot have 2 matches on the same time'});
            }
        }); 
      match.stadium=req.body.stadium;change=true;}

  if(req.body.time!='' && req.body.time!=null)
  {match.time=req.body.time;change=true;}

  if(change)
  {await match.save(); res.status(200).json({status: 'Success', success: true});}
  else{res.status(200).json({status: 'Success but no change', success: true});}
   }
else{res.status(401).json(new AppError('Match not found!', 401));}

})

exports.getMatch = catchAsync(async (req, res, next) => {
    const match= await await  Match.findOne({ _id: req.body.id},err => {console.log(err)});

    if(match!=null)
    {res.status(200).json({status: 'Success', success: true, data: {match}})}
    else{res.status(401).json(new AppError('Match not found!', 401));}
})