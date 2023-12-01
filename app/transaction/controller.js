const Event = require('../../model/Event')
const PointTransaction = require('../../model/PointTransaction')
const User = require('../../model/User')
const jwt = require("jsonwebtoken");
const {JWT_KEY, R2_DOMAIN} = require("../../config/env");
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

const createPointTransaction = (user, event, point, activities, res) => {
  return PointTransaction.findOneAndUpdate(
      {'user.id': user.id, 'event.id': event.id, activities},
      {user, event, point, activities},
      {upsert: true, new: true}
  )
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

module.exports = {
  getAttendanceToken: (req, res) => {
    try {
      const {eventId} = req.params

      const token = jwt.sign({
        id: eventId
      }, JWT_KEY, {expiresIn: 60})

      res.status(200).json({error: false, data: {token}})
    } catch (e) {
      console.log(e)
      res.status(500).json({error: true, message: e.toString()})
    }
  },
  recordAttendanceTransaction: async (req, res) => {
    const {token} = req.body
    const {
      _id: userId,
      userName,
      studyProgram,
      email: userEmail,
      division: userDivision
    } = req.userData

    try {
      const {id: eventId} = await jwt.verify(token, JWT_KEY)

      const event = await Event.findById(eventId).populate('eventDivision')

      const {eventName, startDate, endDate, eventDivision} = event

      const pointEarned = generatePoint('attendance')

      if (pointEarned === -1) {
        return res.status(400).json({
          error: true,
          message: "Aktivitas tidak dikenali!"
        })
      }

      // if (moment().isBefore(moment(startDate))) {
      //   return res.status(400).json({
      //     error: true,
      //     message: "Acara belum dimulai! silahkan ulangi jika sudah memasuki jam acara."
      //   })
      // }
      //
      // if (moment().isAfter(moment(endDate))) {
      //   return res.status(400).json({
      //     error: true,
      //     message: "Acara sudah selesai! tidak bisa melakukan presensi."
      //   })
      // }

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
            email: userEmail,
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
      if (e.toString().includes('TokenExpiredError: jwt expired')) {
        return res.status(404).json({
          error: true,
          message: `Token presensi kadaluarsa, silahkan coba beberapa saat lagi!`
        })
      }

      res.status(500).json({
        error: true,
        message: `Error: ${e.toString()}`
      })
    }
  },
  recordManualAttendanceTransaction: async (req, res) => {
    const {userId, eventId, isAttending} = req.body;

    try {
      const user = await User.findById(userId).populate('division')
      const event = await Event.findById(eventId).populate('eventDivision')

      if (isAttending) {
        return createPointTransaction(
            {
              id: user._id,
              name: user.userName,
              studyProgram: user.studyProgram,
              email: user.email,
              division: {
                id: user.division._id,
                name: user.division.divisionName
              }
            },
            {
              id: event._id,
              name: event.eventName,
              startDate: event.startDate,
              endDate: event.endDate,
              division: {
                id: event.eventDivision._id,
                name: event.eventDivision.divisionName
              }
            },
            5,
            'attendance',
            res
        )
      } else {
        PointTransaction.findOneAndDelete({
          'user.id': userId,
          'event.id': eventId,
          activities: 'attendance'
        })
            .then(r => {
              res.status(200).json({
                error: false,
                data: null
              })
            })
            .catch(e => {
              console.log(e)
              res.status(500).json({
                error: true,
                message: `Error: ${e.toString()}`
              })
            })
      }
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
  },
  getPointTransactionStatus: (req, res) => {
    const {eventId, status, type} = req.query

    if (!eventId || !status) {
      res.status(400).json({
        error: true,
        message: `Error: eventId and status query required!`
      })
    }

    const getAllMembersUser = (userIds) => {
      User.find({position: 'member'})
          .then(r => {
            res.status(200).json({
              error: false,
              data: {
                users: r.map(item => {
                  return {
                    _id: item._id,
                    userName: item.userName,
                    email: item.email,
                    studyProgram: item.studyProgram,
                    profilePicture: `${R2_DOMAIN}/sikeang/assets/coder-logo.jpg`,
                    status: userIds.includes(item._id.toString())
                  }
                })
              }
            })
          })
          .catch(e => {
            console.log(e)
            res.status(500).json({
              error: true,
              message: `Error: ${e.toString()}`
            })
          })
    }

    PointTransaction.find({'event.id': eventId, activities: type})
        .then(r => {
          if (status === 'true') {
            return res.status(200).json({
              error: false,
              data: {
                users: r.map(item => {
                  return {
                    _id: item.user.id,
                    userName: item.user.name,
                    email: item.user.email,
                    studyProgram: item.user.studyProgram,
                    profilePicture: `${R2_DOMAIN}/sikeang/assets/coder-logo.jpg`,
                    status: true
                  }
                })
              }
            })
          }
          const alreadyAttendanceUserIds = r.map(item => item.user.id.toString())
          getAllMembersUser(alreadyAttendanceUserIds)
        })
        .catch(e => {
          console.log(e)
          res.status(500).json({
            error: true,
            message: `Error: ${e.toString()}`
          })
        })
  },
  getTotalPoint: (req, res) => {
    const {_id, userName, division, profilePicture} = req.userData

    PointTransaction.find({'user.id': _id})
        .then(r => {

              res.status(200).json({
                error: false,
                data: {
                  totalPoint: r.reduce((accumulator, currentItem) => accumulator + currentItem.point, 0),
                  name: userName,
                  position: 'Anggota',
                  division: division.divisionName,
                  profilePicture
                }
              })
            }
        )
        .catch(() => res.status(500).json({error: true, message: 'Gagal mendapatkan data point'}))
  }
}
