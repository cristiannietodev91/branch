const express = require("express");
const messageController = require("../controller/messageController");
const router = express.Router();

router.post("/create", messageController.createMessage);

module.exports = router;
