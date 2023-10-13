const mongoose = require('mongoose')

const pointTransactionSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    name: {
      type: String,
    },
    studyProgram: {
      type: String,
    },
    division: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'division'
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
      ref: 'event'
    },
    name: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date
    },
    division: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'division'
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
}, {timestamps: true})

const PointTransaction = mongoose.model('point-transaction', pointTransactionSchema)
module.exports = PointTransaction
