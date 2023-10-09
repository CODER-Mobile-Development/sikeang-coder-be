const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
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
  eventType: { // types of event
    type: String, // values: global || division
    required: true
  },
  eventDivision: { // if eventType global fill global division id
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'division'
  }
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event
