const serviciosDAO = require("../dao/serviciosDAO");
const servicioVehiculoDAO = require("../dao/servicioVehiculoDAO");
const vehiculoDAO = require("../dao/vehiculoDAO");

const listarServicios = (cb) => {
  serviciosDAO.findAll((error, servicios) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, servicios);
    }
  });
};

/**
 *
 * @param {*} paramservicio
 * @param {*} cb
 */
const crearServicio = (paramservicio, cb) => {
  if (paramservicio && paramservicio.placa) {
    vehiculoDAO.findOneByFilter(
      { placa: paramservicio.placa },
      (error, vehiculo) => {
        if (error) {
          cb(error, null);
        } else {
          if (vehiculo) {
            const servicoDb = {
              IdVehiculo: vehiculo.IdVehiculo,
              servicio: paramservicio.servicio,
              valor: paramservicio.valor,
            };
            servicioVehiculoDAO.create(servicoDb, (error, servicio) => {
              if (error) {
                console.error(
                  "Error al registrar servicio al vehiculo",
                  paramservicio
                );
                cb(error, null);
              } else {
                cb(null, servicio);
              }
            });
          }
        }
      }
    );
  } else {
    //TODO Error si no viene placa
  }
};

/**
 *
 * @param {*} IdVehiculo
 * @param {*} cb
 */
const listarServiciosByVehiculo = (IdVehiculo, cb) => {
  servicioVehiculoDAO.findAllByFilter(
    { IdVehiculo: IdVehiculo },
    (error, servicios) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, servicios);
      }
    }
  );
};

module.exports = {
  listarServicios,
  crearServicio,
  listarServiciosByVehiculo,
};
