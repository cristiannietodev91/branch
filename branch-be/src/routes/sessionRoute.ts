import * as express from "express";

import sessionController from "../controller/sessionController";

export const register = (app: express.Application): void => {
  app.post("/session/login", sessionController.logIn);
  app.post("/session/logout", sessionController.logOut);
};