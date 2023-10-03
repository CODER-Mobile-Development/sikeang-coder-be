const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  studyProgram: {
    type: String,
    default: ""
  },
  division: {
    type: String,
    default: ""
  },
  position: { // values: member || admin
    type: String,
    default: ""
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
