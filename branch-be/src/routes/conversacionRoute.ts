import * as express from "express";
import conversacionController from "../controller/conversacionController";

export const register = (app: express.Application): void => {
  app.get(
    "/conversacion/getAllByIdTaller/:Id",
    conversacionController.getConversacionesByIdTaller
  );
};
