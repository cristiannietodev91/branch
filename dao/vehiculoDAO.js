const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.vehiculo.findAll().then((vehiculos) => {
      cb(null, vehiculos);
    });
  },
  create: function (vehiculo, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo.create(vehiculo).then((vehiculo) => {
          return vehiculo;
        });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado transaccion crear vehiculo :::: >', result);
          var vehiculoCreated = result.dataValues;
          cb(null, vehiculoCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (filterVehiculo, vehiculo, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo
          .update(vehiculo, {
            where: filterVehiculo
          })
          .then((vehiculo) => {
            return vehiculo;
          });
      })
      .then(function (result) {
        if (result) {
          console.debug(
            "Resultado despues de actualizar vehiculo :::: >",
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
  getById: function (IdVehiculo, cb) {
    // Find all vehiculos
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo.findByPk(IdVehiculo).then((vehiculo) => {
          return vehiculo;
        });
      })
      .then(function (result) {
        if (result) {
          console.debug("Resultado despues getvehiculo By Id :::: >", result);
          const { dataValues: vehiculoCreated } = result;
          cb(null, vehiculoCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  deleteById: function (IdVehiculo, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo
          .destroy({
            where: { IdVehiculo: IdVehiculo }
          })
          .then((deleted) => {
            return deleted;
          });
      })
      .then(function (result) {
        console.log("Resultado despues Eliminar vehiculo :::: >", result);
        cb(null, result);
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  findAllByFilter: function (filter, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo
          .findAll({
            include: [
              {
                model: models.marca
              },
              {
                model: models.usuarios
              },
              {
                model: models.taller
              }
            ],

            where: filter
          })
          .then((vehiculos) => {
            return vehiculos;
          });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado despues listar vehiculos By Filter :::: >',filter,' Result ::::> ', result);
          cb(null, result);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  findPaginateByFilter: function (
    page,
    paginate,
    filterVehiculo,
    filterUsuario,
    cb
  ) {
    const options = {
      page: page,
      paginate: paginate,
      include: [
        {
          model: models.marca
        },
        {
          model: models.usuarios,
          where: filterUsuario,
          required: true
        },
        {
          model: models.taller
        }
      ],
      where: filterVehiculo
    };
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo.paginate(options).then((vehiculos) => {
          return vehiculos;
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
  findOneByFilter: function (filter, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo
          .findOne({
            include: [
              {
                model: models.marca
              },
              {
                model: models.usuarios
              },
              {
                model: models.taller
              }
            ],
            where: filter
          })
          .then((vehiculo) => {
            return vehiculo;
          });
      })
      .then(function (result) {
        if (result) {
          const { dataValues: vehiculoResult } = result;
          cb(null, vehiculoResult);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  count: (filter, cb) => {
    return models.sequelize
      .transaction((t1) => {
        return models.vehiculo
          .count({
            where: filter
          })
          .then((usuario) => {
            return usuario;
          });
      })
      .then((result) => {
        if (result) {
          cb(null, result);
        } else {
          cb(null, null);
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  }
};
