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
  }
}
