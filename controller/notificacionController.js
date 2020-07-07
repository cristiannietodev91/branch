const HttpStatus = require("http-status-codes");
const notificacionAdapter = require("../adapter/notificacionAdapter");

const getNotificacionesByIdusuario = (req, res, next) => {
  try {
    const { IdUsuario } = req.params;

    console.log("Id usuario :::>", IdUsuario);

    notificacionAdapter.findNotificacionesByIdUsuario(
      IdUsuario,
      (error, notificaciones) => {
        if (error) {
          console.error("Error al listar notificaciones", error);
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        } else {
          return res.status(HttpStatus.OK).json(notificaciones);
        }
      }
    );
  } catch (error) {
    console.error("Error al obtener cita ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getNotificacionesByIdusuario
};
