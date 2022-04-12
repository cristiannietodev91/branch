import * as express from "express";

import tallerController from "../controller/tallerController";

export const register = (app: express.Application): void => {

  app.get("/taller/getAll", tallerController.getAllTalleres);

  app.get("/taller/getById/:Id", tallerController.findTallerById);

  app.post("/taller/create", tallerController.createTaller);

  app.put("/taller/update/:Id", tallerController.updateTaller);

  app.delete("/taller/deleteById/:Id", tallerController.deleteTallerById);

};
