const Event = require('../../model/Event')
const moment = require("moment");

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
    const {eventName, startDate, endDate, description, photoUrl, eventType, eventDivision} = req.body;
    const {id} = req.query

    const updatedData = {}

    if (eventName) updatedData.eventName = eventName
    if (startDate) updatedData.startDate = startDate
    if (endDate) updatedData.endDate = endDate
    if (description) updatedData.description = description
    if (photoUrl) updatedData.photoUrl = photoUrl
    if (eventType) updatedData.eventType = eventType
    if (eventDivision) updatedData.eventDivision = eventDivision

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
  },
  findEventData: async (req, res) => {
    const {query, id, eventTime, eventType} = req.query
    const {division, position} = req.userData

    let dbQuery = {}

    if (query === "id") dbQuery = {_id: id}
    if (query === "eventStatus") {
      const currentDateAndTime = new moment()
      if (eventTime === "live") {
        dbQuery = {
          eventType: eventType, $and: [
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

          res.status(200).json({
            error: false,
            data: {events: r.filter(item => item.eventDivision.toString() === division.toString())}
          })
        })
        .catch(e => {
          console.log(e)
          res.status(500).json({
            error: true,
            message: "Gagal mencari data Event, silahkan coba beberapa saat lagi."
          })
        })
  }
}
