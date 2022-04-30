import messageAdapter from "../adapter/messageAdapter";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";

const createMessage = (req: Request, res: Response) => {
  try {
    const message = req.body;

    messageAdapter
      .createMessage(message)
      ?.then((message) => {
        if (message) {
          res.status(HttpStatus.OK).json(message);
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
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getMessagesByConversacion = (req: Request, res: Response) => {
  try {
    console.log("Peticion recibida de mensajes :::>", req.query);
    const { IdConversacionUser, IdTaller, order } = req.query;

    const conversacion = {
      //uid: IdConversacionUser,
      //IdTaller: IdTaller,
      //TODO: Organize query params
    };
    messageAdapter
      .getMessagesByConversacion(conversacion)
      .then((messages) => {
        if (messages) {
          res.status(HttpStatus.OK).json(messages);
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
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateAllMessagesByConversacion = (req: Request, res: Response): void => {
  try {
    const { IdConversacionUser, IdTaller, typeusuario } = req.body;

    const conversacion = {
      uid: IdConversacionUser,
      IdTaller: IdTaller,
    };

    messageAdapter
      .markallMessagesRead(conversacion, typeusuario)
      .then((result) => {
        if (result) {
          res.status(HttpStatus.OK).json(result);
        }
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al actualizar mensajes ::::::>", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getConversacionesUnread = (req: Request, res: Response): void => {
  try {
    const { IdTaller } = req.params;

    messageAdapter
      .getAllConversationsUnread(IdTaller)
      .then((conversations) => {
        if (conversations) {
          res.status(HttpStatus.OK).json(conversations);
        }
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error get conversaciones unread::::::>", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countMessagesUnReadByIdConversacion = (req: Request, res: Response) => {
  try {
    const IdConversacion = req.params.IdConversacion;
    const { typeusuario } = req.query;

    messageAdapter
      .countMessagesUnReadByIdConversacion(IdConversacion)
      ?.then((messages) => {
        if (messages) {
          return res.status(HttpStatus.OK).json(messages);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  createMessage,
  getMessagesByConversacion,
  updateAllMessagesByConversacion,
  getConversacionesUnread,
  countMessagesUnReadByIdConversacion,
};
