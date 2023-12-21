const express = require('express')
const {
  recordAttendanceTransaction,
  getAttendanceToken,
  getTotalPoint,
  getPointTransactionStatus,
  adminManualRecordTransaction,
} = require("./controller");
const {
  requireAdminOrMember,
  requireAdmin
} = require("../../middleware/authentication");
const router = express.Router()

router.get('/attendance-token/:eventId', requireAdmin, getAttendanceToken)
router.post('/attendance', requireAdminOrMember, recordAttendanceTransaction)
router.post('/', requireAdmin, adminManualRecordTransaction)
router.get('/status', requireAdmin, getPointTransactionStatus)
router.get('/total', requireAdminOrMember, getTotalPoint)

module.exports = router
