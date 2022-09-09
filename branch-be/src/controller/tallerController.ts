import tallerAdapter from "../adapter/tallerAdapter";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";
import Debug from "debug";
import { TallerCreationAttributes } from "../types";
const debug = Debug("branch:server");

const getAllTalleres = (req: Request, res: Response): void => {
  try {
    tallerAdapter
      .getAll()
      .then((talleres) => {
        res.status(HttpStatus.OK).json(talleres);
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

const createTaller = (req: Request, res: Response): void => {
  try {
    const taller = req.body;
    debug("Parametro de taller recibido :::::>", taller);
    taller.estado = "registrado";
    tallerAdapter
      .create(taller)
      ?.then((tallerCreated) => {
        res.status(HttpStatus.OK).json(tallerCreated);
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

const updateTaller = (req: Request, res: Response): void => {
  try {
    const IdTaller = Number(req.params.Id);
    const taller = req.body as TallerCreationAttributes;
    if (IdTaller) {
      tallerAdapter
        .update(IdTaller, taller)
        ?.then(() => {
          res.status(HttpStatus.ACCEPTED).json({
            message: `Se actualizo el Taller ${IdTaller} correctamente`,
          });
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
        .json({ message: "El parametro IdTaller es requerido" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteTallerById = (req: Request, res: Response): void => {
  try {
    const IdTaller = Number(req.params.Id);
    tallerAdapter
      .deleteById(IdTaller)
      ?.then((result) => {
        if (result) {
          res.status(HttpStatus.ACCEPTED).json({
            message: `Se elimino el IdTaller ${IdTaller} correctamente`,
          });
        } else {
          res.status(HttpStatus.OK).json({ message: "Id no encontrado" });
        }
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

const findTallerById = (req: Request, res: Response): void => {
  try {
    const IdTaller = req.params.Id;
    debug("Parametro de IdTaller recibido :::::>", req.params);
    tallerAdapter
      .getById(IdTaller)
      ?.then((taller) => {
        res.status(HttpStatus.OK).json(taller);
      })
      .catch((error) => {
        if (error.errors) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        } else {
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

export default {
  getAllTalleres,
  createTaller,
  updateTaller,
  deleteTallerById,
  findTallerById,
};
