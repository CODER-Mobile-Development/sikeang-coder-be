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
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Division'
      },
      name: {
        type: String
      }
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
    },
    division: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Division'
      },
      name: {
        type: String
      }
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
