const express = require('express')
const {addEventData} = require("./controller");
const router = express.Router()

router.post('/', addEventData)

module.exports = router
