const UPDATEVEHICULO_SUCCESS = {
  code: 1002,
  message: "Se actualizado el vehiculo correctamente",
};

const ERROR_CREATEVEHICULOTALLERASIGNADO = {
  code: 3002,
  message: "El vehiculo ya tiene asignado un taller",
};

const ERROR_SINRESPUESTA = {
  code: 3001,
  message: "No se recibio respuesta del proceso",
};

module.exports = {
  UPDATEVEHICULO_SUCCESS,
  ERROR_SINRESPUESTA,
  ERROR_CREATEVEHICULOTALLERASIGNADO,
};
