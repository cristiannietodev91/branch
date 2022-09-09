import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import notificacionAdapter from "../adapter/notificacionAdapter";

const getNotificacionesByIdusuario = (req: Request, res: Response) => {
  try {
    const { IdUsuario } = req.params;

    notificacionAdapter
      .findNotificacionesByIdUsuario(IdUsuario)
      ?.then((notificaciones) => {
        return res.status(HttpStatus.OK).json(notificaciones);
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al obtener cita ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countNotificacionesByIdusuario = (req: Request, res: Response) => {
  try {
    const { IdUsuario } = req.params;

    notificacionAdapter
      .countNotificacionesByIdUsuario(IdUsuario)
      ?.then((notificaciones) => {
        return res.status(HttpStatus.OK).json(notificaciones);
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al obtener cita ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateNotificacionesByIdusuario = (req: Request, res: Response) => {
  try {
    const { IdUsuario, type, IdNotificacion, IdCita, calificacion } = req.body;

    if (type === "general") {
      notificacionAdapter
        .updateNotificacionGeneralByIdUsuario(IdUsuario)
        ?.then((result) => {
          return res.status(HttpStatus.OK).json(result);
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        });
    } else {
      if (IdNotificacion) {
        notificacionAdapter
          .updateNotificacionByIdNotificacion(
            IdNotificacion,
            IdCita,
            calificacion
          )
          ?.then((result) => {
            return res.status(HttpStatus.OK).json(result);
          })
          .catch((error) => {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          });
      }
    }
  } catch (error) {
    console.error("Error al actualizar notificaciones ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getNotificacionesByIdusuario,
  updateNotificacionesByIdusuario,
  countNotificacionesByIdusuario,
};
