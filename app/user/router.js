const express = require('express')
const {findUsers, createAdminUser} = require("./controller");
const router = express.Router()

router.get('/', findUsers)
router.post('/admin', createAdminUser)

module.exports = router
