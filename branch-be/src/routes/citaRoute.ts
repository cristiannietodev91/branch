import * as express from "express";
import citaController from "../controller/citaController";

export const register = (app: express.Application): void => {
  app.get("/cita/getAll", citaController.getAllCitas);

  app.get("/cita/getById/:Id", citaController.findCitaById);

  app.get("/cita/getByIdTaller/:Id", citaController.getAllCitasByIdTaller);

  app.get("/cita/countByIdTaller/:Id", citaController.countCitasByIdTaller);

  app.get("/cita/countByEstado/:Id", citaController.countCitasByEstadoIdTaller);

  app.get("/cita/countByDate/:Id", citaController.countCitasByDateAndIdTaller);

  app.get("/cita/getByIdUsuario/:Id", citaController.getAllCitasByIdUsuario);

  app.get(
    "/cita/getPasadasByIdUsuario/:Id",
    citaController.getAllCitasPasadasByIdUsuario
  );

  app.get(
    "/cita/getActivasByIdUsuario/:Id",
    citaController.getAllCitasActivasByIdUsuario
  );

  app.get(
    "/cita/getFuturasByIdUsuario/:Id",
    citaController.getAllCitasFuturasByIdUsuario
  );

  app.post("/cita/create", citaController.createCita);

  app.put("/cita/update/:Id", citaController.updateCita);

  app.put("/cita/calificar/:Id", citaController.calificaCita);

  app.delete("/cita/deleteById/:Id", citaController.deleteCitaById);

  app.get(
    "/cita/getByIdTallerAndFilter/:Id",
    citaController.getAllCitasByfilter
  );
};
