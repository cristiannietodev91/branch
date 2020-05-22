const messageDAO = require("../dao/messageDAO");
const conversacionDAO = require("../dao/conversacionDAO");
const { Op } = require("sequelize");

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
            IdConversacion: conversacion.IdConversacion,
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

module.exports = {
  createMessage,
  getMessagesByConversacion,
};
