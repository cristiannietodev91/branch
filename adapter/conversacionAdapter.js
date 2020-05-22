const conversacionDAO = require("../dao/conversacionDAO");
const { Op } = require("sequelize");

const createConversacion = (conversacion, cb) => {
  conversacionDAO.create(conversacion, (error, conversacion) => {
    if (error) {
      cb(error, null);
    } else {
      if (conversacion) {
        cb(null, conversacion);
      }
    }
  });
};

const createOrGetConversacion = (paramconversacion, cb) => {
  console.log("Conversacion parama :::>", paramconversacion);
  conversacionDAO.findOneByFilter(paramconversacion, (error, conversacion) => {
    if (error) {
      cb(error, null);
    } else {
      if (conversacion && conversacion.IdConversacion) {
        cb(null, conversacion);
      } else {
        conversacionDAO.create(paramconversacion, (error, conversacion) => {
          if (error) {
            cb(error, null);
          } else {
            if (conversacion) {
              cb(null, conversacion);
            }
          }
        });
      }
    }
  });
};

module.exports = {
  createConversacion,
  createOrGetConversacion,
};
