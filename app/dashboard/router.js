const express = require('express')
const {getSummaryPoint} = require("./controller");
const {requireAdmin} = require("../../middleware/authentication");
const router = express.Router()

router.get("/", requireAdmin, getSummaryPoint)

module.exports = router;
