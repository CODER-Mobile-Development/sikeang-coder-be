const User = require('../../model/User')
const {R2_DOMAIN} = require("../../config/env");

module.exports = {
  findUsers: (req, res) => {
    const {query, value} = req.query

    let dbQuery = {}

    if (query === 'id') {
      dbQuery = {_id: value}
    }
    if (query === 'position') {
      dbQuery = {position: value}
    }
    if (query === 'division') {
      dbQuery = {division: value}
    }

    User.find(dbQuery)
        .populate('division')
        .then(r => {
          res.status(200).json({
            error: false,
            data: {users: r}
          })
        })
        .catch(e => res.status(500).json({
          error: true,
          message: e.toString()
        }))
  },
  createUser: (req, res) => {
    const {position} = req.params
    const {userName, email, divisionId, studyProgram} = req.body;

    User.create({
      userName,
      email,
      studyProgram,
      position,
      division: divisionId,
      profilePicture: `${R2_DOMAIN}/sikeang/assets/coder-logo.jpg`
    })
        .then(r => {
          res.status(200).json({
            error: false,
            data: r
          })
        })
        .catch(e => res.status(500).json({
          error: true,
          message: e.toString()
        }))
  }
}
