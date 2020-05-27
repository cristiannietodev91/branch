let serviciosAdapter = require("../adapter/serviciosAdapter");
const HttpStatus = require("http-status-codes");

const getListaServicios = (req, res, next) => {
  try {
    serviciosAdapter.listarServicios((error, servicios) => {
      if (error) {
        console.error(
          "Error al realizar la transaccion de listar Servicios:::>",
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
        if (servicios) {
          res.status(HttpStatus.OK).json(servicios);
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

const crearServicio = (req, res, next) => {
  try {
    const { body: servicio } = req;

    serviciosAdapter.crearServicio(servicio, (error, servicio) => {
      if (error) {
        console.error(
          "Error al realizar la transaccion de listar Servicios:::>",
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
        if (servicio) {
          res.status(HttpStatus.OK).json(servicio);
        }
      }
    });
  } catch (error) {
    console.error("Error al crear servicio a un vehiculo ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getListaServiciosByVehiculo = (req, res, next) => {
  try {
    const IdVehiculo = req.params.Id;
    serviciosAdapter.listarServiciosByVehiculo(
      IdVehiculo,
      (error, servicios) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion de listar Servicios:::>",
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
          if (servicios) {
            res.status(HttpStatus.OK).json(servicios);
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

module.exports = {
  getListaServicios,
  crearServicio,
  getListaServiciosByVehiculo,
};
