const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.message.findAll().then((messages) => {
      cb(null, messages);
    });
  },
  create: function (message, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.message.create(message).then((message) => {
          return message;
        });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado transaccion crear cita :::: >', result);
          var messageCreated = result.dataValues;
          cb(null, messageCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (IdMessage, message, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.message
          .update(message, {
            where: { IdMessage: IdMessage },
          })
          .then((message) => {
            return message;
          });
      })
      .then(function (result) {
        if (result) {
          console.debug(
            "Resultado despues de actualizar message :::: >",
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
};
