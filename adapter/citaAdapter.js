let citaDAO = require("../dao/citaDAO");
const { Op } = require("sequelize");

/**
 *
 * @param {*} filterCita
 * @param {*} filtervehiculo
 * @param {*} filterOrden
 * @param {*} cb
 */
const findCitaByFilter = (filterCita, filtervehiculo, filterOrden, cb) => {
  citaDAO.findAllByFilter(filterCita, filtervehiculo, filterOrden, function (
    error,
    citas
  ) {
    if (error) {
      cb(error, null);
    } else {
      if (citas) {
        cb(null, citas);
      }
    }
  });
};

/**
 *
 * @param {*} IdTaller
 */
const getAllCitasByIdTaller = (IdTaller, cb) => {
  citaDAO.findAllByFilter(
    { IdTaller: IdTaller, estado: { [Op.ne]: "Cancelada" } },
    {},
    {},
    function (error, citas) {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter({}, { IdUsuario: IdUsuario }, {}, (error, citas) => {
    if (error) {
      cb(error, null);
    } else {
      if (citas) {
        cb(null, citas);
      }
    }
  });
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasPasadasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter(
    {
      [Op.or]: [
        { estado: "Cancelada" },
        { estado: "Incumplida" },
        { estado: "Finalizada" },
      ],
    },
    { IdUsuario: IdUsuario },
    {},
    (error, citas) => {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasFuturasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter(
    {
      [Op.or]: [{ estado: "Solicitada" }, { estado: "Confirmada" }],
      fechaCita: { [Op.gte]: new Date() },
    },
    { IdUsuario: IdUsuario },
    { IdOrdenTrabajo: { [Op.is]: null } },
    (error, citas) => {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

/**
 *
 * @param {*} IdUsuario
 * @param {*} cb
 */
const getAllCitasActivasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter(
    { estado: "Cumplida" },
    { IdUsuario: IdUsuario },
    { [Op.or]: [{ estado: "Aceptado" }, { estado: "Pendiente" }] },
    (error, citas) => {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

module.exports = {
  findCitaByFilter,
  getAllCitasByIdTaller,
  getAllCitasByIdUsuario,
  getAllCitasPasadasByIdUsuario,
  getAllCitasFuturasByIdUsuario,
  getAllCitasActivasByIdUsuario,
};
