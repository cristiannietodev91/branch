import * as express from "express";
import marcaController from "../controller/marcaController";

export const register = (app: express.Application): void => {
  app.get("/marca/getAll", marcaController.getAllMarcas);

  app.get("/marca/getAllUnique", marcaController.getListUniqueMarcas);

  app.get("/marca/getAllByMarca/:marca", marcaController.getAllMarcaByMarca);

  app.get("/marca/getById/:Id", marcaController.findMarcaById);

  app.post("/marca/create", marcaController.createMarca);

  app.put("/marca/update/:Id", marcaController.updateMarca);

  app.delete("/marca/deleteById/:Id", marcaController.deleteMarcaById);
};
