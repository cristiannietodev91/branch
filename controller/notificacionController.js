const HttpStatus = require("http-status-codes");
const notificacionAdapter = require("../adapter/notificacionAdapter");

const getNotificacionesByIdusuario = (req, res, next) => {
  try {
    const { IdUsuario } = req.params;

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

const countNotificacionesByIdusuario = (req, res, next) => {
  try {
    const { IdUsuario } = req.params;

    notificacionAdapter.countNotificacionesByIdUsuario(
      IdUsuario,
      (error, notificaciones) => {
        if (error) {
          console.error("Error al contar notificaciones", error);
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

const updateNotificacionesByIdusuario = (req, res, next) => {
  try {
    const { IdUsuario, type, IdNotificacion } = req.body;

    if (type === "general") {
      notificacionAdapter.updateNotificacionGeneralByIdUsuario(
        IdUsuario,
        (error, result) => {
          if (error) {
            console.error("Error al actualizar las notificaciones", error);
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          } else {
            return res.status(HttpStatus.OK).json(result);
          }
        }
      );
    } else {
      if (IdNotificacion) {
        notificacionAdapter.updateNotificacionByIdNotificacion(
          IdNotificacion,
          (error, result) => {
            if (error) {
              console.error("Error al actualizar las notificaciones", error);
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
            } else {
              return res.status(HttpStatus.OK).json(result);
            }
          }
        );
      }
    }
  } catch (error) {
    console.error("Error al actualizar notificaciones ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getNotificacionesByIdusuario,
  updateNotificacionesByIdusuario,
  countNotificacionesByIdusuario
};
