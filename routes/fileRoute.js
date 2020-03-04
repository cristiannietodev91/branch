var express = require('express');
var fileController = require('../controller/fileController')
var router = express.Router();

router.post('/send', fileController.fileUpload);

router.put('/send', fileController.fileUpload);

module.exports = router;