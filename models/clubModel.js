const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './../.env' })

const Schema = mongoose.Schema
const clubSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide the club name'],
    trim: true
  }
})

const Club = mongoose.model('Club', clubSchema)

module.exports = Club
