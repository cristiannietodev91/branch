const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.notificacion.findAll().then((ordenes) => {
      cb(null, ordenes);
    });
  },
  create: function (orden, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.notificacion.create(orden).then((orden) => {
          return orden;
        });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado transaccion crear cita :::: >', result);
          cb(null, result.dataValues);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (filterNotificacion, notificacion, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.notificacion
          .update(notificacion, {
            where: filterNotificacion
          })
          .then((orden) => {
            return orden;
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
  getById: function (IdOrdenTrabajo, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.notificacion
          .findByPk(IdOrdenTrabajo, {
            include: [
              {
                model: models.mecanico
              },
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
              }
            ]
          })
          .then((orden) => {
            return orden;
          });
      })
      .then(function (result) {
        if (result) {
          cb(null, result.dataValues);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  deleteById: function (IdOrdenTrabajo, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.notificacion
          .destroy({
            where: { IdOrdenTrabajo: IdOrdenTrabajo }
          })
          .then((deleted) => {
            return deleted;
          });
      })
      .then(function (result) {
        cb(null, result);
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  findAllByFilter: function (filterNotificacion, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.notificacion
          .findAll({
            where: filterNotificacion,
            limit: 10,
            order: [["createdAt", "DESC"]]
          })
          .then((notificaciones) => {
            return notificaciones;
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
  },
  count: (filter, groupBy, cb) => {
    // Find all users
    if (groupBy && groupBy.length > 0) {
      return models.sequelize
        .transaction((t1) => {
          return models.notificacion
            .count({
              group: groupBy,
              attributes: groupBy,
              where: filter
            })
            .then((notificaciones) => {
              return notificaciones;
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
          return models.notificacion
            .count({
              where: filter
            })
            .then((ordenes) => {
              return ordenes;
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
