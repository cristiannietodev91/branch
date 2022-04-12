import * as express from "express";

import vehiculoController from "../controller/vehiculoController";

export const register = (app: express.Application): void => {
  app.get("/vehiculo/getAll", vehiculoController.getAllVehiculos);

  app.get("/vehiculo/getById/:Id", vehiculoController.findVehiculoById);

  app.get(
    "/vehiculo/getByIdTaller/:Id",
    vehiculoController.getAllVehiculosByIdTaller
  );

  app.get(
    "/vehiculo/countByIdTaller/:Id",
    vehiculoController.countVehiculosByIdTaller
  );

  app.get(
    "/vehiculo/getPaginateByIdTaller/:Id",
    vehiculoController.getAllPaginateFilterVehiculosByIdTaller
  );

  app.get(
    "/vehiculo/getByIdUsuario/:Id",
    vehiculoController.getAllVehiculosByIdUsuario
  );

  app.get("/vehiculo/getByPlaca/:placa", vehiculoController.getVehiculoByPlaca);

  app.post("/vehiculo/create", vehiculoController.createVehiculo);

  app.put("/vehiculo/update/:Id", vehiculoController.updateVehiculo);

  app.put(
    "/vehiculo/updateFechavencimiento/:Id",
    vehiculoController.updateFechaVencimiento
  );

  app.delete("/vehiculo/deleteById/:Id", vehiculoController.deleteVehiculoById);
};
