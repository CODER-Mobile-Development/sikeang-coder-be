const express = require('express')
const {
  addDivisionData,
  getAllDivisionData,
  updateDivisionData,
} = require("./controller");
const {requireAdmin} = require("../../middleware/authentication");
const router = express.Router()

router.post('/', requireAdmin, addDivisionData)
router.get('/', requireAdmin, getAllDivisionData)
router.put('/:divisionId', requireAdmin, updateDivisionData)

module.exports = router
