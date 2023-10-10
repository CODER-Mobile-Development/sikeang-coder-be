const express = require('express')
const {addEventData} = require("./controller");
const {requireAdmin} = require("../../middleware/authentication");
const router = express.Router()

router.post('/', requireAdmin, addEventData)

module.exports = router
