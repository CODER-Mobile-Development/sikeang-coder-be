const Event = require('../../model/Event')
const Division = require('../../model/Division')
const moment = require("moment");
const {v4: uuidv4} = require('uuid');
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const {R2_ENDPOINT, R2_ACCESS_KEY, R2_ACCESS_SECRET, R2_BUCKET, R2_DOMAIN} = require("../../config/env");

module.exports = {
  addEventData: (req, res) => {
    const {eventName, startDate, endDate, description, photoUrl, eventType, eventDivision} = req.body

    Event.create({eventName, startDate, endDate, description, photoUrl, eventType, eventDivision})
        .then(r => {
          res.status(200).json({error: false, data: r})
        })
        .catch(e => {
          console.log(e)
          res.status(500).json({
            error: true,
            message: "Gagal membuat data Event, silahkan coba beberapa saat lagi."
          })
        })
  },
  editEventData: (req, res) => {
    const {eventName, startDate, endDate, description, photoUrl, eventType, eventLocation, eventDivision} = req.body;
    const {id} = req.query

    Division.findOne({divisionName: 'Global'})
        .then(divisionGlobal => {
          const {_id: divisionGlobalId} = divisionGlobal
          const updatedData = {}

          if (eventName) updatedData.eventName = eventName
          if (startDate) updatedData.startDate = startDate
          if (endDate) updatedData.endDate = endDate
          if (description) updatedData.description = description
          if (photoUrl) updatedData.photoUrl = photoUrl
          if (eventType) updatedData.eventType = eventType
          if (eventDivision) updatedData.eventDivision = eventType === 'global' ? divisionGlobalId : eventDivision
          if (eventLocation) updatedData.eventLocation = eventLocation

          Event.findByIdAndUpdate(id, updatedData, {new: true})
              .then(r => {
                res.status(200).json({error: false, data: r})
              })
              .catch(e => {
                console.log(e)
                res.status(500).json({
                  error: true,
                  message: "Gagal mengubah data Event, silahkan coba beberapa saat lagi."
                })
              })
        })
        .catch((e) => {
          console.log(e)
          res.status(500).json({
            error: true,
            message: "Gagal mengubah data Event, silahkan coba beberapa saat lagi."
          })
        })
  },
  findEventData: async (req, res) => {
    const {query, id, eventTime, eventType} = req.query
    const {division: userDivision, position, _id} = req.userData

    let dbQuery = {}

    if (query === "id") dbQuery = {_id: id}
    if (query === "eventStatus") {
      const currentDateAndTime = new moment()
      if (eventTime === "live") {
        dbQuery = {
          eventType: eventType,
          $and: [
            {startDate: {$lte: currentDateAndTime}},
            {endDate: {$gte: currentDateAndTime}}
          ]
        }
      } else if (eventTime === "upcoming") {
        dbQuery = {
          eventType: eventType,
          $and: [
            {startDate: {$gt: currentDateAndTime}},
            {endDate: {$gt: currentDateAndTime}}
          ]
        }
      } else if (eventTime === "finished") {
        dbQuery = {
          eventType: eventType,
          $and: [
            {startDate: {$lt: currentDateAndTime}},
            {endDate: {$lt: currentDateAndTime}}
          ]
        }
      } else {
        res.status(500).json({
          error: true,
          message: "Time value tidak valid!"
        })
      }
    }

    Event.find(dbQuery)
        .then(r => {
          if (position === "admin") {
            return res.status(200).json({error: false, data: {events: r}})
          }

          if (query === 'eventStatus') {
            if (eventType === 'division') {
              return res.status(200).json({
                error: false,
                data: {
                  events: r.filter(item =>
                      item.eventDivision.toString() === userDivision._id.toString()
                  )
                }
              })
            }

            if (eventType === 'global') {
              return res.status(200).json({
                error: false,
                data: {
                  events: r.filter(item =>
                      item.eventType === 'global'
                  )
                }
              })
            }

            return res.status(400).json({
              error: true,
              message: 'Request not valid! missing eventType query parameter.'
            })
          }

          if (query === 'id') {
            if (r.length > 0 && r[0].eventType === 'division') {
              return res.status(200).json({
                error: false,
                data: {
                  events: r.filter(item =>
                      item.eventDivision.toString() === userDivision._id.toString()
                  )
                }
              })
            }

            return res.status(200).json({
              error: false,
              data: {
                events: r
              }
            })
          }

          return res.status(400).json({
            error: true,
            message: 'Request not valid!'
          })
        })
        .catch(e => {
          console.log(e)
          res.status(500).json({
            error: true,
            message: "Gagal mencari data Event, silahkan coba beberapa saat lagi."
          })
        })
  },
  getPreSignedKeyUpload: (req, res) => {
    const {fileFormat} = req.query
    const key = `sikeang-events/${uuidv4()}.${fileFormat}`

    const S3 = new S3Client({
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_ACCESS_SECRET
      },
      region: "auto",
    });

    getSignedUrl(S3,
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
        }),
        {
          expiresIn: 3600
        }
    )
        .then((r) => res.status(200).json({
          error: false,
          data: {
            url: r,
            photoURI: `${R2_DOMAIN}/${key}`
          }
        }))
        .catch((e) => {
          console.log(e)
          res.status(500).json({
            error: true,
            message: "Gagal meminta upload file, silahkan coba beberapa saat lagi."
          })
        })
  }
}
