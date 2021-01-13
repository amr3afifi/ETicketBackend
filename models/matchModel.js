const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './../.env' })

const Schema = mongoose.Schema
const matchSchema = new Schema({
  team1: {
    type: String,
    required: [true, 'Please provide team1'],
    trim: true
  },
  team2: {
    type: String,
    required: [true, 'Please provide team2'],
    trim: true
  },
  stadium: {
    type: String,
    required: [true, 'Please provide stadium'],
    trim: true
  },
  refree: {
    type: String,
    required: [true, 'Please provide refree'],
    trim: true
  },
  lineman1: {
    type: String,
    required: [true, 'Please provide lineman1'],
    trim: true
  },
  lineman2: {
    type: String,
    required: [true, 'Please provide lineman2'],
    trim: true
  },
  date: {
    type: String,
    format: Date,
    default: '2021-01-01'
  },
  time: {
    type: String,
    format: Date,
    default: '00:00'
  },
  seats: {
    type: Array
  }
})

const Match = mongoose.model('Match', matchSchema)

module.exports = Match
