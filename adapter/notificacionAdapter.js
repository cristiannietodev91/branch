const notificacionDAO = require("../dao/NotificacionDAO");

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
    { IdUsuario: IdUsuario },
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

module.exports = {
  crearNotificacion,
  findNotificacionesByIdUsuario
};
