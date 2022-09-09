import * as express from "express";
import fileController from "../controller/fileController";

import cors from "cors";

export const register = (app: express.Application): void => {
  app.post("/file/signed", cors(), fileController.signedS3);

  app.post("/file/signedURL", cors(), fileController.signedURL);

  app.post("/file/sendFile", cors(), fileController.sendFile);
};
