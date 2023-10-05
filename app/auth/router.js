const express = require('express')
const {actionUserAuthGoogle} = require("./controller");
const router = express.Router();

router.post('/google', actionUserAuthGoogle)

module.exports = router;
