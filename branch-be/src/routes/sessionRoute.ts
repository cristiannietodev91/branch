import * as express from "express";
import sessionController from "../controller/sessionController";
import { registerUserSchema } from "../schema/schemaValidation";
import {
  createValidator
} from "express-joi-validation";

const validator = createValidator({ passError: true });

export const register = (app: express.Application): void => {
  app.post("/session/login", sessionController.logIn);
  app.post("/session/logout", sessionController.logOut);
  app.post("/session/createUser", validator.body(registerUserSchema), sessionController.registerUserFirebase);
};