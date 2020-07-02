const messageDAO = require("../dao/messageDAO");
const conversacionDAO = require("../dao/conversacionDAO");
const { Sequelize } = require("sequelize");

const createMessage = (message, cb) => {
  messageDAO.create(message, (error, message) => {
    if (error) {
      cb(error, null);
    } else {
      if (message) {
        cb(null, message);
      }
    }
  });
};

const getMessagesByConversacion = (conversacion, order, cb) => {
  conversacionDAO.findOneByFilter(conversacion, (error, conversacion) => {
    if (error) {
      cb(error, null);
    } else {
      if (conversacion && conversacion.IdConversacion) {
        messageDAO.findAllByFilter(
          {
            IdConversacion: conversacion.IdConversacion
          },
          order,
          (error, messages) => {
            if (error) {
              cb(error, null);
            } else {
              cb(null, messages);
            }
          }
        );
      }
    }
  });
};

const getAllConversacionsUnread = (IdTaller, cb) => {
  messageDAO.findDistinctAllByFilter(
    { read: false },
    {},
    [
      [
        Sequelize.fn("DISTINCT", Sequelize.col("IdConversacion")),
        "IdConversacion"
      ]
    ],
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        let Ids = result.map((a) => a.IdConversacion);

        const filter = {
          IdTaller: IdTaller,
          IdConversacion: Ids
        };
        conversacionDAO.findAllByFilter(filter, (error, conversaciones) => {
          if (error) {
            cb(error, null);
          } else {
            cb(null, conversaciones);
          }
        });
      }
    }
  );
};

/**
 *
 * @param {*} IdConversacion
 * @param {*} cb
 */
const markallMessagesRead = (conversacion, typeusuario, cb) => {
  conversacionDAO.findOneByFilter(conversacion, (error, conversacion) => {
    if (error) {
      cb(error, null);
    } else {
      if (conversacion && conversacion.IdConversacion) {
        messageDAO.update(
          {
            IdConversacion: conversacion.IdConversacion,
            read: false,
            typeusuario: typeusuario
          },
          { read: true },
          (error, result) => {
            if (error) {
              cb(error, null);
            } else {
              cb(null, result);
            }
          }
        );
      }
    }
  });
};

const countMessagesUnReadByIdConversacion = (
  IdConversacion,
  typeusuario,
  cb
) => {
  messageDAO.count(
    { IdConversacion: IdConversacion, typeusuario: typeusuario, read: false },
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

module.exports = {
  createMessage,
  getMessagesByConversacion,
  markallMessagesRead,
  getAllConversacionsUnread,
  countMessagesUnReadByIdConversacion
};
