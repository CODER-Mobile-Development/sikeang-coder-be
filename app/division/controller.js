const Division = require('../../model/Division')
const User = require('../../model/User')

module.exports = {
  addDivisionData: (req, res) => {
    const {divisionName} = req.body;

    Division.create({divisionName})
        .then(r =>
            res.status(200).json({error: false, data: r})
        )
        .catch(e =>
            res.status(500).json({error: true, message: `Error: ${e.toString()}`})
        )
  },
  getAllDivisionData: (req, res) => {
    Division.find({})
        .then(r =>
            res.status(200).json({
              error: false,
              data: {
                divisions: r.filter(item => item.divisionName !== 'Global')
              }
            })
        )
        .catch(e =>
            res.status(500).json({error: true, message: `Error: ${e.toString()}`})
        )
  },
  updateDivisionData: (req, res) => {
    const {divisionId} = req.params
    const {divisionName} = req.body

    Division.findByIdAndUpdate(divisionId, {divisionName})
        .then(() => {
          res.status(200).json({
            error: false,
            data: null
          })
        })
        .catch(e => res.status(500).json({
          error: true,
          message: e.toString()
        }))
  },
  deleteDivisionData: (req, res) => {
    const {divisionId} = req.params

    const deleteDivisionData = () => {
      Division.findByIdAndDelete(divisionId)
          .then(() => {
            res.status(200).json({
              error: false,
              data: null
            })
          })
          .catch(e => res.status(500).json({
            error: true,
            message: e.toString()
          }))
    }

    User.find({position: 'member', division: divisionId})
        .then(r => {
          if (r.length === 0) {
            return deleteDivisionData()
          }

          res.status(400).json({
            error: true,
            message: 'Sebelum menghapus data divisi, hapus/pindahkan semua user yang masih tergabung di divisi ini!'
          })
        })
        .catch(e => res.status(500).json({
          error: true,
          message: e.toString()
        }))
  }
}
