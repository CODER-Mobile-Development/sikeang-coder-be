const Event = require('../../model/Event')
const Division = require('../../model/Division')
const PointTransaction = require('../../model/PointTransaction')
const moment = require('moment')

module.exports = {
  recordAttendanceTransaction: async (req, res) => {
    const {eventId, activities} = req.body
    const {
      _id: userId,
      userName,
      programStudy,
      division: userDivisionId
    } = req.userData

    const findDuplicateTransaction = (userId, eventId) => {
      return PointTransaction.find({'user.id': userId, 'event.id': eventId})
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

    const createPointTransaction = (user, event, point, activities) => {
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

    const generatePoint = (activity) => {
      if (activity === "attendance") {
        return 5
      } else if (activity === "committee") {
        return 10
      } else {
        return -1
      }
    }

    try {
      const duplicateTransactionData = await findDuplicateTransaction(userId, eventId)

      if (duplicateTransactionData) return res.status(200).json({error: false, data: duplicateTransactionData})

      const event = await Event.findById(eventId)

      const {eventName, startDate, endDate, eventDivision: eventDivisionId} = event

      const pointEarned = generatePoint(activities)

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
            programStudy,
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
          activities
      )
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: true,
        message: `Error: ${e.toString()}`
      })
    }
  }
}
