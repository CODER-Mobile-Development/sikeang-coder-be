const express = require('express')
const {
  actionUserAuthGoogle,
  getUserData
} = require("./controller");
const {requireAdminOrMember} = require("../../middleware/authentication");
const router = express.Router();

router.post('/google', actionUserAuthGoogle)
router.get('/verify', requireAdminOrMember, getUserData)

module.exports = router;
