const express = require("express");
const messageController = require("../controller/messageController");
const router = express.Router();

router.post("/create", messageController.createMessage);

router.get(
  "/getMessagesByConversacion",
  messageController.getMessagesByConversacion
);

router.put(
  "/updatereadAllMessages",
  messageController.updateAllMessagesByConversacion
);

router.get(
  "/getConversacionUnread/:IdTaller",
  messageController.getConversacionesUnread
);

router.get(
  "/countByIdConversacion/:IdConversacion",
  messageController.countMessagesUnReadByIdConversacion
);

module.exports = router;
