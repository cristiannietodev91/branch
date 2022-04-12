import * as express from "express";
import mecanicoController from "../controller/mecanicoController";

export const register = (app: express.Application): void => {
  app.get("/mecanico/getAll", mecanicoController.getAllMecanicos);

  app.get(
    "/mecanico/getAllByIdTaller/:Id",
    mecanicoController.getAllMecanicosByIdtaller
  );

  app.get("/mecanico/getById/:Id", mecanicoController.findMecanicoById);

  app.post("/mecanico/create", mecanicoController.createMecanico);

  app.put("/mecanico/update/:Id", mecanicoController.updateMecanico);

  app.delete("/mecanico/deleteById/:Id", mecanicoController.deleteCitaById);
};
