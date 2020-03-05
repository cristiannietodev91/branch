var express = require('express');
var fileController = require('../controller/fileController')
var router = express.Router();
var cors = require('cors')

router.post('/send',cors(), fileController.fileUpload);

router.put('/send',cors(), fileController.sendFile);

module.exports = router;