const Event = require('../../model/Event')

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
  }
}
