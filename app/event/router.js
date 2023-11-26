const express = require('express')
const {addEventData, editEventData, findEventData, getPreSignedKeyUpload, deleteEventData} = require("./controller");
const {requireAdmin, requireAdminOrMember} = require("../../middleware/authentication");
const router = express.Router()

router.post('/', requireAdmin, addEventData)
router.put('/', requireAdmin, editEventData)
router.get('/', requireAdminOrMember, findEventData)
router.delete('/:id', requireAdmin, deleteEventData)
router.get('/upload-request', requireAdmin, getPreSignedKeyUpload)

module.exports = router
