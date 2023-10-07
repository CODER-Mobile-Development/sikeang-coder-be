const Division = require('../../model/Division')

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
  }
}
