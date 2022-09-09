import serviciosAdapter from "../adapter/serviciosAdapter";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";

const getListaServicios = (req: Request, res: Response): void => {
  try {
    serviciosAdapter
      .listarServicios()
      .then((servicios) => {
        if (servicios) {
          res.status(HttpStatus.OK).json(servicios);
        }
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al crear vehiculo ::::::>", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const crearServicio = (req: Request, res: Response): void => {
  try {
    const { body: servicio } = req;

    serviciosAdapter
      .crearServicio(servicio)
      .then((servicio) => {
        if (servicio) {
          res.status(HttpStatus.OK).json(servicio);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al crear servicio a un vehiculo ::::::>", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getListaServiciosByVehiculo = (req: Request, res: Response): void => {
  try {
    const IdVehiculo = req.params.Id;
    serviciosAdapter
      .listarServiciosByVehiculo(IdVehiculo)
      ?.then((servicios) => {
        if (servicios) {
          res.status(HttpStatus.OK).json(servicios);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al crear vehiculo ::::::>", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getListaServicios,
  crearServicio,
  getListaServiciosByVehiculo,
};
