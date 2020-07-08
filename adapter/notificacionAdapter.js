const notificacionDAO = require("../dao/NotificacionDAO");
const { Op } = require("sequelize");

const crearNotificacion = (notificacion, cb) => {
  const notificacionDb = {
    IdUsuario: notificacion.IdUsuario,
    text: notificacion.text,
    typenotificacion: notificacion.typenotificacion,
    read: notificacion.read,
    dataAdicional: notificacion.dataAdicional
  };
  notificacionDAO.create(notificacionDb, (error, notificacion) => {
    if (error) {
      console.error("Error al registrar notificacion", notificacion);
      cb(error, null);
    } else {
      cb(null, notificacion);
    }
  });
};

const findNotificacionesByIdUsuario = (IdUsuario, cb) => {
  notificacionDAO.findAllByFilter(
    { IdUsuario: IdUsuario, read: false },
    (error, notificaciones) => {
      if (error) {
        console.error("Error al registrar notificaciones", notificaciones);
        cb(error, null);
      } else {
        cb(null, notificaciones);
      }
    }
  );
};

const updateNotificacionGeneralByIdUsuario = (IdUsuario, cb) => {
  notificacionDAO.update(
    {
      IdUsuario: IdUsuario,
      read: false,
      typenotificacion: { [Op.ne]: "Calificación" }
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
};

const updateNotificacionByIdNotificacion = (IdNotificacion, cb) => {
  notificacionDAO.update(
    {
      IdNotificacion: IdNotificacion,
      read: false
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
};

module.exports = {
  crearNotificacion,
  findNotificacionesByIdUsuario,
  updateNotificacionGeneralByIdUsuario,
  updateNotificacionByIdNotificacion
};
