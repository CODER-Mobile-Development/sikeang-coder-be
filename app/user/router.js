const express = require('express')
const {findUsers} = require("./controller");
const router = express.Router()

router.get('/', findUsers)

module.exports = router
