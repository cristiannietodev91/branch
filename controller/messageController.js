let messageAdapter = require("../adapter/messageAdapter");
var HttpStatus = require("http-status-codes");

const createMessage = (req, res, next) => {
  try {
    const message = req.body;

    messageAdapter.createMessage(message, (error, message) => {
      if (error) {
        console.error(
          "Error al realizar la transaccion de crear Message:::>",
          "error ::>",
          error.message
        );
        if (error.errors) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        } else {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      } else {
        if (message) {
          res.status(HttpStatus.OK).json(message);
        }
      }
    });
  } catch (error) {
    console.error("Error al crear vehiculo ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getMessagesByConversacion = (req, res, next) => {
  try {
    console.log("Peticion recibida de mensajes :::>", req.query);
    const { IdConversacionUser, IdTaller, order } = req.query;

    const conversacion = {
      uid: IdConversacionUser,
      IdTaller: IdTaller
    };
    messageAdapter.getMessagesByConversacion(
      conversacion,
      order,
      (error, messages) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion de listar Messages:::>",
            "error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (messages) {
            res.status(HttpStatus.OK).json(messages);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al crear vehiculo ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateAllMessagesByConversacion = (req, res, next) => {
  try {
    const { IdConversacionUser, IdTaller, typeusuario } = req.body;

    const conversacion = {
      uid: IdConversacionUser,
      IdTaller: IdTaller
    };

    messageAdapter.markallMessagesRead(
      conversacion,
      typeusuario,
      (error, result) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion marcar como leido mensajes:::>",
            "error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (result) {
            res.status(HttpStatus.OK).json(result);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al actualizar mensajes ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getConversacionesUnread = (req, res, next) => {
  try {
    const { IdTaller } = req.params;

    messageAdapter.getAllConversacionsUnread(IdTaller, (error, result) => {
      if (error) {
        console.error(
          "Error al realizar la transaccion get conversaciones unread:::>",
          "error ::>",
          error.message
        );
        if (error.errors) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        } else {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      } else {
        if (result) {
          res.status(HttpStatus.OK).json(result);
        }
      }
    });
  } catch (error) {
    console.error("Error get conversaciones unread::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const countMessagesUnReadByIdConversacion = (req, res, next) => {
  try {
    const IdConversacion = req.params.IdConversacion;
    const { typeusuario } = req.query;

    messageAdapter.countMessagesUnReadByIdConversacion(
      IdConversacion,
      typeusuario,
      (error, messages) => {
        if (error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error });
        } else {
          if (messages) {
            return res.status(HttpStatus.OK).json(messages);
          } else {
            return res.status(HttpStatus.OK).json({});
          }
        }
      }
    );
  } catch (error) {
    console.error(
      "Error al contar Mensaje Unread By conversacion :::>",
      IdTaller,
      " Error :::>",
      error
    );
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  getMessagesByConversacion,
  updateAllMessagesByConversacion,
  getConversacionesUnread,
  countMessagesUnReadByIdConversacion
};
