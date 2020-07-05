const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.conversacion.findAll().then((conversaciones) => {
      cb(null, conversaciones);
    });
  },
  create: function (conversacion, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.conversacion.create(conversacion).then((conversacion) => {
          return conversacion;
        });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado transaccion crear cita :::: >', result);
          var conversacionCreated = result.dataValues;
          cb(null, conversacionCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (IdConversacion, conversacion, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.conversacion
          .update(conversacion, {
            where: { IdConversacion: IdConversacion }
          })
          .then((conversacion) => {
            return conversacion;
          });
      })
      .then(function (result) {
        if (result) {
          console.debug(
            "Resultado despues de actualizar conversacion :::: >",
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
  findOneByFilter: function (filter, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.conversacion
          .findOne({
            where: filter
          })
          .then((conversacion) => {
            return conversacion;
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
  findAllByFilter: function (filterConversacion, filterUsuario, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.conversacion
          .findAll({
            include: [
              {
                model: models.usuarios,
                where: filterUsuario
              },
              {
                model: models.taller
              }
            ],
            where: filterConversacion
          })
          .then((conversaciones) => {
            return conversaciones;
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
  findPaginateByFilter: function (page, paginate, filterConversacion, cb) {
    const options = {
      page: page,
      paginate: paginate,
      include: [
        {
          model: models.usuarios
        },
        {
          model: models.taller
        }
      ],
      where: filterConversacion
    };
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.conversacion.paginate(options).then((vehiculos) => {
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
  }
};
