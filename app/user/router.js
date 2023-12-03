const express = require('express')
const {findUsers, createUser, updateUser} = require("./controller");
const router = express.Router()

router.get('/', findUsers)
router.post('/:position', createUser)
router.put('/:position/:id', updateUser)

module.exports = router
