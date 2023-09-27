const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    default: "",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  photoUrl: {
    type: String,
    default: "",
  },
  eventType: {
    type: String,
    default: "",
    required: true
  }
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event
