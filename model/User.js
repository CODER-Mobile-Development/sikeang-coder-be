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
    required: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'division'
  },
  position: { // values: member || admin
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
