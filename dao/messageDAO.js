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
  update: function (filter, message, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.message
          .update(message, {
            where: filter
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
  findAllByFilter: function (filterMessages, order, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.message
          .findAll({
            where: filterMessages,
            order: [["createdAt", order ? order : "DESC"]]
          })
          .then((messages) => {
            return messages;
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
  findDistinctAllByFilter: function (
    filterMessages,
    filterConversacion,
    attributes,
    cb
  ) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.message
          .findAll({
            attributes: attributes,
            where: filterMessages
          })
          .then((messages) => {
            return messages;
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
  count: (filter, cb) => {
    return models.sequelize
      .transaction((t1) => {
        return models.message
          .count({
            where: filter
          })
          .then((messages) => {
            return messages;
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
