const express = require("express");
const messageController = require("../controller/messageController");
const router = express.Router();

router.post("/create", messageController.createMessage);

router.get(
  "/getMessagesByConversacion",
  messageController.getMessagesByConversacion
);

module.exports = router;
