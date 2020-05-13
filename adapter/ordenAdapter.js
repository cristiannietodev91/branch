const ordenDAO = require("../dao/OrdenDAO");
const { Op } = require("sequelize");

const getOrdenesByIdTallerAndFilter = (IdTaller, filter, cb) => {
  ordenDAO.findAllByFilter(
    {
      IdTaller: IdTaller,
      CodigoOrden: {
        [Op.substring]: filter,
      },
    },
    {},
    function (error, ordenes) {
      if (error) {
        cb(error, null);
      } else {
        if (ordenes) {
          cb(null, ordenes);
        }
      }
    }
  );
};

const getOrdenesByIdTallerAndIdCita = (IdTaller, IdCita, cb) => {
  ordenDAO.findAllByFilter(
    {
      IdTaller: IdTaller,
      IdCita: IdCita,
    },
    {},
    function (error, ordenes) {
      if (error) {
        cb(error, null);
      } else {
        if (ordenes) {
          cb(null, ordenes);
        }
      }
    }
  );
};

module.exports = {
  getOrdenesByIdTallerAndFilter,
  getOrdenesByIdTallerAndIdCita,
};
