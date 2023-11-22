const express = require('express')
const {addDivisionData, getAllDivisionData} = require("./controller");
const {requireAdmin} = require("../../middleware/authentication");
const router = express.Router()

router.post('/', requireAdmin, addDivisionData)
router.get('/', requireAdmin, getAllDivisionData)

module.exports = router
