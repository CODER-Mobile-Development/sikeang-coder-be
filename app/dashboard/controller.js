const PointTransaction = require('../../model/PointTransaction')
const Division = require('../../model/Division')
const User = require('../../model/User')

module.exports = {
  getSummaryPoint: async (req, res) => {
    const {userType, userData} = req
    const {_id, userName, profilePicture, division: divisionData} = userData

    if (userType === 'member') {
      try {
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
              profilePicture,
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
    } else if (userType === 'admin') {
      try {
        const allDivision = (await Division.find({}))
            .filter(division => division.divisionName !== 'Global')
        const allDivisionIds = allDivision
            .map(division => division._id)

        const members = await User.find({
          position: 'member',
          division: {$in: allDivisionIds}
        })

        const totalMembers = members.length
        const totalDivisions = allDivisionIds.length

        const summaryDivision = allDivision.map(division => {
          return {
            divisionId: division._id,
            divisionName: division.divisionName,
            membersCount: members.filter(member =>
                division._id.toString() === member.division.toString()
            ).length
          }
        })

        res.status(200).json({
          error: false,
          data: {
            user: {
              name: userName,
              division: divisionData.divisionName,
              profilePicture,
              position: "BPH"
            },
            totalMembers,
            totalDivisions,
            summaryDivision
          }
        })
      } catch (e) {
        res.status(500).json({error: true, message: `Error: ${e.toString()}`})
      }
    }
  }
}
