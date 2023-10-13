const express = require('express')
const {getSummaryPoint} = require("./controller");
const {requireAdminOrMember} = require("../../middleware/authentication");
const router = express.Router()

router.get("/", requireAdminOrMember, getSummaryPoint)

module.exports = router;
