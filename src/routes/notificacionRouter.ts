import * as express from "express";
import notificacionController from "../controller/notificacionController";

export const register = (app: express.Application): void => {
  app.get(
    "/notificacion/getByIdUsuario/:IdUsuario",
    notificacionController.getNotificacionesByIdusuario
  );

  app.get(
    "/notificacion/countByIdUsuario/:IdUsuario",
    notificacionController.countNotificacionesByIdusuario
  );

  app.put(
    "/notificacion/updateReadNotificaciones",
    notificacionController.updateNotificacionesByIdusuario
  );
};
