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
            where: { IdConversacion: IdConversacion },
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
            where: filter,
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
};
