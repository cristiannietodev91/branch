import { Request, Response } from "express";
import vehiculoAdapter from "../adapter/vehiculoAdapter";
import HttpStatus from "http-status-codes";
import Debug from "debug";
import { VehiculoCreationRequest } from "../types";
const debug = Debug("branch:server");
import moment from "moment";
import { Op } from "sequelize";

moment.locale("es");

const getAllVehiculos = (req: Request, res: Response): void => {
  try {
    vehiculoAdapter
      .findAllVehiculos()
      .then((vehiculos) => {
        res.status(HttpStatus.OK).json(vehiculos);
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: error.message });
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
};

const createVehiculo = (req: Request, res: Response): void => {
  try {
    const vehiculo = req.body as VehiculoCreationRequest;
    debug("Parametro de vehiculo recibido :::::>", vehiculo);

    vehiculoAdapter
      .crearVehiculo(vehiculo)
      ?.then((vehiculoCreated) => {
        if (vehiculoCreated) {
          res.status(HttpStatus.OK).json(vehiculoCreated);
        }
      })
      .catch((error) => {
        debug("Error al crear vehiculo ", error);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      });
  } catch (error) {
    debug("Error unhandle creating vehicle", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
};

const updateVehiculo = (req: Request, res: Response): void => {
  try {
    const IdVehiculo = Number(req.params.Id);
    const vehiculo = req.body;
    debug("Parametro de vehiculo recibido para actualizar :::::>", vehiculo);
    if (IdVehiculo && vehiculo) {
      vehiculoAdapter
        .updateVehiculo(vehiculo, IdVehiculo)
        .then((result) => {
          if (result) {
            res.status(HttpStatus.ACCEPTED).json({
              message: `Se actualizo el Vehiculo ${IdVehiculo} correctamente`,
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ message: "No se actualizo el vehiculo" });
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: error.message });
          }
        });
    } else {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdVehiculo es requerido" });
    }
  } catch (error) {
    debug("Error al actualizar vehiculo ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
};

const updateFechaVencimiento = (req: Request, res: Response): void => {
  try {
    const IdVehiculo = Number(req.params.Id);
    const vehiculo = req.body;
    debug("Parametro de vehiculo recibido para actualizar :::::>", vehiculo);
    if (IdVehiculo && vehiculo) {
      const vehiculoUpdate = {
        fvtecnomecanica: vehiculo.fvtecnomecanica
          ? moment(vehiculo.fvtecnomecanica, "DD/MM/YYYY").toDate()
          : undefined,
        fvsoat: vehiculo.fvsoat
          ? moment(vehiculo.fvsoat, "DD/MM/YYYY").toDate()
          : undefined,
      };

      vehiculoAdapter
        .updateVehiculo(vehiculoUpdate, IdVehiculo)
        .then((result) => {
          if (result) {
            res.status(HttpStatus.ACCEPTED).json({
              message: `Se actualizo el Vehiculo ${IdVehiculo} correctamente`,
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ error: "No se actualizo el vehiculo" });
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        });
    } else {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdVehiculo es requerido" });
    }
  } catch (error) {
    debug("Error al actualizar vehiculo ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteVehiculoById = (req: Request, res: Response): void => {
  try {
    const IdVehiculo = Number(req.params.Id);
    debug("Parametro de IdVehiculo recibido :::::>", IdVehiculo);
    vehiculoAdapter
      .deleteById(IdVehiculo)
      ?.then((result) => {
        if (result) {
          res.status(HttpStatus.ACCEPTED).json({
            message: `Se elimino el IdVehiculo ${IdVehiculo} correctamente`,
          });
        } else {
          res.status(HttpStatus.OK).json({ message: "Id no encontrado" });
        }
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.errors[0] });
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const findVehiculoById = (req: Request, res: Response): void => {
  try {
    const IdVehiculo = Number(req.params.Id);
    vehiculoAdapter
      .getById(IdVehiculo)
      ?.then((vehiculo) => {
        res.status(HttpStatus.OK).json(vehiculo);
      })
      .catch((error) => {
        if (error instanceof Error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllVehiculosByIdTaller = (req: Request, res: Response): void => {
  try {
    const IdTaller = Number(req.params.Id);
    debug("Parametro taller recibido :::::>", req.query);

    vehiculoAdapter
      .findAllByFilter({ IdTaller })
      ?.then((vehiculos) => {
        res.status(HttpStatus.OK).json(vehiculos);
      })
      .catch((error) => {
        if (error instanceof Error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getVehiculoByPlaca = (req: Request, res: Response): void => {
  try {
    const placa = req.params.placa;
    debug("Parametro de palca recibido :::::>", placa);
    vehiculoAdapter
      .findOneByFilter({ placa })
      ?.then((vehiculo) => {
        res.status(HttpStatus.OK).json(vehiculo);
      })
      .catch((error) => {
        if (error instanceof Error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllVehiculosByIdUsuario = (req: Request, res: Response): void => {
  try {
    const IdUsuario = req.params.Id;
    vehiculoAdapter
      .findAllByFilter({ IdUsuario })
      ?.then((vehiculos) => {
        res.status(HttpStatus.OK).json(vehiculos);
      })
      .catch((error) => {
        if (error instanceof Error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countVehiculosByIdTaller = (req: Request, res: Response): void => {
  try {
    const IdTaller = Number(req.params.Id);
    vehiculoAdapter
      .countVehiculosByIdTaller(IdTaller)
      ?.then((count) => {
        res.status(HttpStatus.OK).json(count);
      })
      .catch((error) => {
        if (error instanceof Error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllPaginateFilterVehiculosByIdTaller = (
  req: Request,
  res: Response
): void => {
  try {
    const page = Number(req.query.page);
    const perpage = Number(req.query.perPage);
    const columnFilter = req.query.columnFilter;
    const valueSearch = req.query.filter;
    const IdTaller = req.params.Id;

    let filterVehiculo = {};
    let filterUsuario = {};

    if (columnFilter === "placa") {
      if (valueSearch) {
        filterVehiculo = {
          IdTaller,
          placa: {
            [Op.substring]: valueSearch,
          },
        };
      } else {
        filterVehiculo = {
          IdTaller,
        };
      }
    } else {
      filterVehiculo = {
        IdTaller,
      };
      if (columnFilter === "firstName" || columnFilter === "identificacion") {
        if (valueSearch) {
          filterUsuario = {
            [columnFilter]: {
              [Op.substring]: valueSearch,
            },
          };
        } else {
          filterUsuario = {};
        }
      }
    }

    debug("Parametro taller recibido :::::>", req.query);

    vehiculoAdapter
      .findPaginateByFilter(page, perpage, filterVehiculo, filterUsuario)
      ?.then((result) => {
        res.status(HttpStatus.OK).json(result);
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getAllVehiculos,
  createVehiculo,
  updateVehiculo,
  updateFechaVencimiento,
  deleteVehiculoById,
  findVehiculoById,
  getAllVehiculosByIdTaller,
  getVehiculoByPlaca,
  getAllVehiculosByIdUsuario,
  countVehiculosByIdTaller,
  getAllPaginateFilterVehiculosByIdTaller,
};
