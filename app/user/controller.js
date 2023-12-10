const User = require('../../model/User')
const {R2_DOMAIN} = require("../../config/env");
const Division = require("../../model/Division");

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

    const addUserAction = (division) => {
      User.create({
        userName,
        email,
        studyProgram,
        position,
        division,
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

    if (position === 'admin') {
      Division.findOne({divisionName: 'Global'})
          .then(r => addUserAction(r._id))
          .catch(e => res.status(500).json({
            error: true,
            message: e.toString()
          }))
    } else if (position === 'member') {
      addUserAction(divisionId)
    }
  },
  updateUser: (req, res) => {
    const {position, id} = req.params
    const {userName, email, divisionId, studyProgram} = req.body;

    const editUserAction = (division) => {
      User.findOneAndUpdate({_id: id, position}, {
        userName,
        email,
        studyProgram,
        division
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

    if (position === 'admin') {
      Division.findOne({divisionName: 'Global'})
          .then(r => editUserAction(r._id))
          .catch(e => res.status(500).json({
            error: true,
            message: e.toString()
          }))
    } else if (position === 'member') {
      editUserAction(divisionId)
    }
  },
  deleteUser: (req, res) => {
    const {position, id} = req.params

    User.findOneAndDelete({_id: id, position})
        .then(r => {
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
}
