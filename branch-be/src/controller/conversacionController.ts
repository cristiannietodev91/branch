import conversacionAdapter from "../adapter/conversacionAdapter";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";

const getConversacionesByIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    //const { firstName } = req.query;
    //TODO:  send firstName param

    conversacionAdapter
      .getConversacionesByTallerAndNombreUsuario(IdTaller)
      ?.then((conversaciones) => {
        if (conversaciones) {
          res.status(HttpStatus.OK).json(conversaciones);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al get conversaciones ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getConversacionesByIdTaller,
};
