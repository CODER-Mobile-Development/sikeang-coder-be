const express = require('express')
const {
  recordAttendanceTransaction,
  recordCommitteeTransaction
} = require("./controller");
const {
  requireAdminOrMember,
  requireAdmin
} = require("../../middleware/authentication");
const router = express.Router()

router.post('/attendance', requireAdminOrMember, recordAttendanceTransaction)
router.post('/committee', requireAdmin, recordCommitteeTransaction)

module.exports = router
