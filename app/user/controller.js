const User = require('../../model/User')

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
  }
}
