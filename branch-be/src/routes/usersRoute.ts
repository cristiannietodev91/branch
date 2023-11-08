import * as express from "express";
import { createFirebaseUserSchema } from "../schema/schemaValidation";
import {
  createValidator
} from "express-joi-validation";

const validator = createValidator({ passError: true });

import userController from "../controller/userController";

export const register = (app: express.Application): void => {
  app.get("/usuario/getAll", userController.getAllUsers);

  app.get("/usuario/getByEmail/:email", userController.findUserByEmail);

  app.get("/usuario/getById/:Id", userController.findUserById);

  app.get("/usuario/loginUsuario/:uid", userController.getUserByUID);

  app.get(
    "/usuario/countByIdTaller/:IdWorkshop",
    userController.countUsersByIdWorkshop
  );

  app.delete("/usuario/deleteById/:Id", userController.deleteUserById);

  app.delete("/usuario/:Id", userController.deleteUserById);

  app.post("/usuario/createFireBaseUser", validator.body(createFirebaseUserSchema), userController.createFireBaseUser);

  app.put("/usuario/update/:uid", userController.updateUsuarioByUid);

  app.put(
    "/usuario/updateByIdUsuario/:id",
    userController.updateUsuarioByIdUsuario
  );
};
