import * as express from "express";
import servicioController from "../controller/serviciosController";

export const register = (app: express.Application): void => {
  app.get("/servicios/getAll", servicioController.getListaServicios);

  app.post("/servicios/create", servicioController.crearServicio);

  app.get("/servicios/getByVehiculo/:Id", servicioController.getListaServiciosByVehiculo);
};
