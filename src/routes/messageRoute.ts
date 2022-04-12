import * as express from "express";
import messageController from "../controller/messageController";

export const register = (app: express.Application): void => {
  app.post("/message/create", messageController.createMessage);

  app.get(
    "/message/getMessagesByConversacion",
    messageController.getMessagesByConversacion
  );

  app.put(
    "/message/updatereadAllMessages",
    messageController.updateAllMessagesByConversacion
  );

  app.get(
    "/message/getConversacionUnread/:IdTaller",
    messageController.getConversacionesUnread
  );

  app.get(
    "/message/countByIdConversacion/:IdConversacion",
    messageController.countMessagesUnReadByIdConversacion
  );
};
