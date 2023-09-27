const mongoose = require('mongoose')

const pointTransactionSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
    },
    programStudy: {
      type: String,
    },
    division: {
      type: String
    }
  },
  event: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event'
    },
    name: {
      type: String,
    },
    startDate: {
      type: Date,
    }
  },
  point: {
    type: Number,
    required: true
  },
  activities: { // values: attendance || committee
    type: String,
    required: true
  }
})

const PointTransaction = mongoose.model('PointTransaction', pointTransactionSchema)
module.exports = PointTransaction
