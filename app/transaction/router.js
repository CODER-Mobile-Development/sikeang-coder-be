const express = require('express')
const {
  recordAttendanceTransaction,
  recordCommitteeTransaction,
  getAttendanceToken,
  getTotalPoint,
  getUserAttendanceStatus,
  recordManualAttendanceTransaction,
} = require("./controller");
const {
  requireAdminOrMember,
  requireAdmin
} = require("../../middleware/authentication");
const router = express.Router()

router.get('/attendance-token/:eventId', requireAdmin, getAttendanceToken)
router.post('/attendance', requireAdminOrMember, recordAttendanceTransaction)
router.get('/attendance-status', requireAdmin, getUserAttendanceStatus)
router.post('/manual-attendance', requireAdmin, recordManualAttendanceTransaction)
router.post('/committee', requireAdmin, recordCommitteeTransaction)
router.get('/total', requireAdminOrMember, getTotalPoint)

module.exports = router
