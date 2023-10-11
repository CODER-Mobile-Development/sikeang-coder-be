const express = require('express')
const {addEventData, editEventData} = require("./controller");
const {requireAdmin} = require("../../middleware/authentication");
const router = express.Router()

router.post('/', requireAdmin, addEventData)
router.put('/', requireAdmin, editEventData)

module.exports = router
