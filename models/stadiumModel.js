const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './../.env' })

const Schema = mongoose.Schema
const stadiumSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide the stadium name'],
    trim: true
  },
  rows: {
    type: Number,
    required: [true, 'Please number of rows'],
    trim: true
  },
  seats: {
    type: Number,
    required: [true, 'Please number of seats in a row'],
    trim: true
  }
})

const Stadium = mongoose.model('Stadium', stadiumSchema)

module.exports = Stadium
