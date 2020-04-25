var express = require("express");
var fileController = require("../controller/fileController");
var router = express.Router();
var cors = require("cors");

router.post("/signed", cors(), fileController.signedS3);

router.post("/signedURL", cors(), fileController.signedURL);

router.post("/sendFile", cors(), fileController.sendFile);

module.exports = router;
