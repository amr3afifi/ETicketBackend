/** MongoDB Model for the Match object.
 * @module models/match
 * @requires mongoose
 */

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
  date: {
    type: String,
    format: Date,
    default: '2021-01-01',
    validate: {
      validator: function () {
        todaysDate = new Date();
        enteredDate=new Date(this.date);
        return (enteredDate>=todaysDate)
      }
    }
  },
  time: {
    type: String,
    format: Date,
    default: '00:00',
    validate: {
      validator: function () {
        todaysDate = new Date();
        enteredDate=new Date(this.date);
        return (enteredDate>=todaysDate)
      }
    }
  },
  seats: []
})

const Match = mongoose.model('Match', matchSchema)

module.exports = Match
