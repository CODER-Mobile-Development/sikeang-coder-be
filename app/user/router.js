const express = require('express')
const {
  findUsers,
  createUser,
  updateUser,
  deleteUser
} = require("./controller");
const router = express.Router()

router.get('/', findUsers)
router.post('/:position', createUser)
router.put('/:position/:id', updateUser)
router.delete('/:position/:id', deleteUser)

module.exports = router
