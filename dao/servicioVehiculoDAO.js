const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.serviciovehiculo.findAll().then((servicios) => {
      cb(null, servicios);
    });
  },
  create: function (servicio, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.serviciovehiculo.create(servicio).then((servicio) => {
          return servicio;
        });
      })
      .then(function (result) {
        if (result) {
          console.debug(
            "Resultado transaccion crear servicio al vehiculo:::: >",
            result
          );
          var servicioCreated = result.dataValues;
          cb(null, servicioCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (IdServicio, servicio, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.serviciovehiculo
          .update(servicio, {
            where: { IdServicio: IdServicio },
          })
          .then((servicio) => {
            return servicio;
          });
      })
      .then(function (result) {
        if (result) {
          console.debug(
            "Resultado despues de actualizar servicio al vehiculo:::: >",
            result
          );
          cb(null, result);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  getById: function (IdServicio, cb) {
    return models.sequelize
      .transaction((t1) => {
        return models.serviciovehiculo
          .findByPk(IdServicio, {})
          .then((servicio) => {
            return servicio;
          });
      })
      .then(function (result) {
        if (result) {
          const servicioGet = result.dataValues;
          cb(null, servicioGet);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  deleteById: function (IdServicio, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.serviciovehiculo
          .destroy({
            where: { IdServicio: IdServicio },
          })
          .then((deleted) => {
            return deleted;
          });
      })
      .then(function (result) {
        console.log("Resultado despues Eliminar servicio :::: >", result);
        cb(null, result);
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  findAllByFilter: function (filterServicio, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.serviciovehiculo
          .findAll({
            where: filterServicio,
          })
          .then((servicios) => {
            return servicios;
          });
      })
      .then(function (result) {
        if (result) {
          cb(null, result);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
};
