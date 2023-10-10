const express = require('express')
const {recordAttendanceTransaction} = require("./controller");
const {requireAdminOrMember} = require("../../middleware/authentication");
const router = express.Router()

router.post('/attendance', requireAdminOrMember, recordAttendanceTransaction)

module.exports = router
