const PointTransaction = require('../../model/PointTransaction')
const Division = require('../../model/Division')

module.exports = {
  getSummaryPoint: async (req, res) => {
    try {
      const {_id, userName, division} = req.userData

      const divisionData = await Division.findById(division)
      const historyPoint = await PointTransaction.find({'user.id': _id})
      const totalPointCommittee = historyPoint
          .filter(item => item.activities === "committee")
          .reduce((accumulator, currentItem) => accumulator + currentItem.point, 0);
      const totalPointAttendance = historyPoint
          .filter(item => item.activities === "attendance")
          .reduce((accumulator, currentItem) => accumulator + currentItem.point, 0);

      res.status(200).json({
        error: false,
        data: {
          user: {
            name: userName,
            division: divisionData.divisionName,
            position: "Anggota"
          },
          totalPointCommittee,
          totalPointAttendance,
          totalPoint: totalPointCommittee + totalPointAttendance,
          historyPoint
        }
      })
    } catch (e) {
      res.status(500).json({error: true, message: `Error: ${e.toString()}`})
    }
  }
}
