const Event = require('../../model/Event')
const Division = require('../../model/Division')
const PointTransaction = require('../../model/PointTransaction')
const User = require('../../model/User')
const moment = require('moment')
const mongoose = require("mongoose");

const generatePoint = (activity) => {
  if (activity === "attendance") {
    return 5
  } else if (activity === "committee") {
    return 10
  } else {
    return -1
  }
}

module.exports = {
  recordAttendanceTransaction: async (req, res) => {
    const {eventId} = req.body
    const {
      _id: userId,
      userName,
      studyProgram,
      division: userDivisionId
    } = req.userData

    const findDuplicateTransaction = (userId, eventId, activities, res) => {
      return PointTransaction.find({
        'user.id': userId,
        'event.id': eventId,
        activities
      })
          .then(r => {
            if (r.length === 0) {
              return false
            } else {
              return r[0]
            }
          })
          .catch(e => {
            console.log(e)
            return res.status(500).json({
              error: false,
              message: "Gagal mencari data Point Transaction. Silahkan coba beberapa saat lagi."
            })
          })
    }

    const createPointTransaction = (user, event, point, activities, res) => {
      return PointTransaction.create({user, event, point, activities})
          .then(r => {
            res.status(200).json({
              error: false,
              data: r
            })
          })
          .catch(e => {
            console.log(e)
            res.status(500).json({
              error: false,
              message: "Gagal membuat data Point Transaction. Silahkan coba beberapa saat lagi."
            })
          })
    }

    try {
      const duplicateTransactionData = await findDuplicateTransaction(userId, eventId, "attendance", res)

      if (duplicateTransactionData) return res.status(200).json({error: false, data: duplicateTransactionData})

      const event = await Event.findById(eventId)

      const {eventName, startDate, endDate, eventDivision: eventDivisionId} = event

      const pointEarned = generatePoint('attendance')

      if (pointEarned === -1) {
        return res.status(400).json({
          error: true,
          message: "Aktivitas tidak dikenali!"
        })
      }

      const userDivision = await Division.findById(userDivisionId)
      const eventDivision = await Division.findById(eventDivisionId)

      if (moment().isBefore(moment(startDate))) {
        return res.status(400).json({
          error: true,
          message: "Acara belum dimulai! silahkan ulangi jika sudah memasuki jam acara."
        })
      }

      if (moment().isAfter(moment(endDate))) {
        return res.status(400).json({
          error: true,
          message: "Acara sudah selesai! tidak bisa melakukan presensi."
        })
      }

      const checkMatchDivision = (userDivisionName, eventDivisionName) =>
          (eventDivisionName === userDivisionName) || (eventDivisionName === "Global")

      if (!checkMatchDivision(userDivision.divisionName, eventDivision.divisionName)) {
        return res.status(400).json({error: true, message: "Data divisi tidak sesuai!"})
      }

      return createPointTransaction(
          {
            id: userId,
            name: userName,
            studyProgram,
            division: {
              id: userDivision._id,
              name: userDivision.divisionName
            }
          },
          {
            id: eventId,
            name: eventName,
            startDate,
            endDate,
            division: {
              id: eventDivision._id,
              name: eventDivision.divisionName
            }
          },
          pointEarned,
          'attendance',
          res
      )
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: true,
        message: `Error: ${e.toString()}`
      })
    }
  },
  recordCommitteeTransaction: async (req, res) => {
    const {userIds, eventId} = req.body

    try {
      const parseIdToObjectId = userIds.map(item => new mongoose.Types.ObjectId(item))

      const userData = await User.find({
        _id: {
          $in: parseIdToObjectId
        }
      }).populate('division')
      const eventData = await Event.findById(eventId).populate('eventDivision')

      const writeQueryPointTransaction = userData.map(item => {
        return {
          updateOne: {
            filter: {
              'user.id': item._id,
              'event.id': eventId,
              activities: 'committee'
            },
            update: {
              'user.id': item._id,
              'user.name': item.userName,
              'user.studyProgram': item.studyProgram,
              'user.division.id': item.division._id,
              'user.division.name': item.division.divisionName,
              'event.id': eventData._id,
              'event.name': eventData.eventName,
              'event.startDate': eventData.startDate,
              'event.endDate': eventData.endDate,
              'event.division.id': eventData.eventDivision._id,
              'event.division.name': eventData.eventDivision.divisionName,
              point: generatePoint('committee'),
              activities: "committee"
            },
            upsert: true
          }
        }
      })

      PointTransaction.bulkWrite(writeQueryPointTransaction)
          .then(() => res.status(200).json({error: false, data: {ok: true}}))
          .catch(e => res.status(500).json({error: true, message: `Error: ${e.toString()}`}))
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: true,
        message: `Error: ${e.toString()}`
      })
    }
  }
}
