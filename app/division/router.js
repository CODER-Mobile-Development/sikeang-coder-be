const express = require('express')
const {addDivisionData} = require("./controller");
const {requireAdmin} = require("../../middleware/authentication");
const router = express.Router()

router.post('/', requireAdmin, addDivisionData)

module.exports = router
