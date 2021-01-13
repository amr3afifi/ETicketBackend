const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config({ path: './../.env' })

const Schema = mongoose.Schema
const userSchema = new Schema({
  first: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true
  },
  last: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Please provide your username'],
    trim: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 30,
    select: false
  },
  role: {
    type: String,
    enum: ['fan', 'manager', 'admin'],
    default: 'fan'
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
    trim: true,
    lowercase: true,
  },
  city: {
    type: String,
    trim: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: String,
    format: Date,
    default: '1980-01-01',
    validate: {
      validator: function () {
        return (this.dateOfBirth < '2010-01-01' && this.dateOfBirth > '1920-01-01')
      }
    }
  },
  gender: {
    type: String,
    default: 'male'
  },
  active: {
    type: Boolean,
    default: false
  },
  reservedMatches: []
})

userSchema.pre('save', async function (next) {
  // if the password changed hash it before saving in the database
  if (!this.isModified('password')) return next()


  this.password = await bcrypt.hash(this.password, 12)

  next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  // check if the given password matches the existing one
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
