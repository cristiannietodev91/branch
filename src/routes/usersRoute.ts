import * as express from "express";

import userController from "../controller/userController";

export const register = (app: express.Application): void => {
  app.get("/usuario/getAll", userController.getAllUsuarios);

  app.get("/usuario/getByEmail/:email", userController.findUserByEmail);

  app.get("/usuario/getById/:Id", userController.findUsuarioById);

  app.get("/usuario/loginUsuario/:uid", userController.loginUserTallerByUID);

  app.get(
    "/usuario/countByIdTaller/:Id",
    userController.countUsuariosByIdTaller
  );

  app.delete("/usuario/deleteById/:Id", userController.deleteUsuarioById);

  app.post("/usuario/createFireBaseUser", userController.createFireBaseUsuario);

  app.put("/usuario/update/:uid", userController.updateUsuarioByUid);

  app.put(
    "/usuario/updateByIdUsuario/:id",
    userController.updateUsuarioByIdUsuario
  );
};
