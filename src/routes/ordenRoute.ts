import * as express from "express";
import ordenController from "../controller/ordenController";

export const register = (app: express.Application): void => {
  app.get("/orden/getById/:Id", ordenController.getOrdenById);

  //router.get("/getAllEtapas", ordenController.getAllEtapas);

  app.post("/orden/create", ordenController.createOrden);

  app.get("/orden/getByIdTaller/:Id", ordenController.getAllOrdenesByIdTaller);

  app.get("/orden/countByIdTaller/:Id", ordenController.countOrdenesByIdTaller);

  app.put("/orden/update/:Id", ordenController.updateOrden);

  app.get(
    "/orden/getByIdTallerAndFilter/:Id",
    ordenController.getAllOrdenesByIdTallerAndFilter
  );

  app.get(
    "/orden/getByIdTallerAndIdCita/:Id",
    ordenController.getAllOrdenesByIdTallerAndIdCita
  );
};
