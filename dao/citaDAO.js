const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.cita.findAll().then((citas) => {
      cb(null, citas);
    });
  },
  create: function (cita, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.cita.create(cita).then((cita) => {
          return cita;
        });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado transaccion crear cita :::: >', result);
          const { dataValues: citaCreated } = result;

          cb(null, citaCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (IdCita, cita, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.cita
          .update(cita, {
            where: { IdCita: IdCita }
          })
          .then((cita) => {
            return cita;
          });
      })
      .then(function (result) {
        if (result) {
          console.debug("Resultado despues de actualizar cita :::: >", result);
          cb(null, result);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  getById: function (IdCita, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.cita
          .findByPk(IdCita, {
            include: [
              {
                model: models.vehiculo,
                include: [
                  {
                    model: models.marca
                  },
                  {
                    model: models.usuarios
                  }
                ]
              },
              {
                model: models.taller
              },
              {
                model: models.mecanico
              }
            ]
          })
          .then((cita) => {
            return cita;
          });
      })
      .then(function (result) {
        if (result) {
          const { dataValues: citaCreated } = result;
          cb(null, citaCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  deleteById: function (IdCita, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.cita
          .destroy({
            where: { IdCita: IdCita }
          })
          .then((deleted) => {
            return deleted;
          });
      })
      .then(function (result) {
        console.log("Resultado despues Eliminar cita :::: >", result);
        cb(null, result);
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  findAllByFilter: function (filterCita, filterVehiculo, filterOrden, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.cita
          .findAll({
            include: [
              {
                model: models.vehiculo,
                where: filterVehiculo,
                include: [
                  {
                    model: models.marca
                  },
                  {
                    model: models.usuarios
                  }
                ]
              },
              {
                model: models.taller
              },
              {
                model: models.mecanico
              },
              {
                model: models.ordentrabajo,
                where: filterOrden,
                include: [
                  {
                    model: models.mecanico,
                    required: false
                  }
                ],
                required: false
              }
            ],
            where: filterCita,
            order: [
              ["fechaCita", "DESC"],
              ["horaCita", "DESC"],
              [models.ordentrabajo, "IdEtapa"]
            ]
          })
          .then((citas) => {
            return citas;
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
  count: (filter, groupBy, attributes, cb) => {
    // Find all users
    if (groupBy && groupBy.length > 0) {
      return models.sequelize
        .transaction((t1) => {
          return models.cita
            .count({
              group: groupBy,
              attributes: attributes,
              where: filter
            })
            .then((citas) => {
              return citas;
            });
        })
        .then((result) => {
          cb(null, result);
        })
        .catch((err) => {
          cb(err, null);
        });
    } else {
      return models.sequelize
        .transaction((t1) => {
          return models.cita
            .count({
              where: filter
            })
            .then((citas) => {
              return citas;
            });
        })
        .then((result) => {
          cb(null, result);
        })
        .catch((err) => {
          cb(err, null);
        });
    }
  }
};
