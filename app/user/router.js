const express = require('express')
const {findUsers, createUser} = require("./controller");
const router = express.Router()

router.get('/', findUsers)
router.post('/:position', createUser)

module.exports = router
