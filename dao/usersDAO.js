const models = require("../database/models");

module.exports = {
  findAll: function (cb) {
    // Find all users
    models.usuarios.findAll().then((users) => {
      cb(null, users);
    });
  },
  create: function (usuario, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.usuarios.create(usuario).then((user) => {
          return user;
        });
      })
      .then(function (result) {
        if (result) {
          //console.debug('Resultado despues usuario :::: >', result);
          var userCreated = result.dataValues;
          cb(null, userCreated);
        } else {
          cb(null, null);
        }
      })
      .catch(function (err) {
        cb(err, null);
      });
  },
  update: function (filter, usuario, cb) {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.usuarios
          .update(usuario, {
            where: filter
          })
          .then((user) => {
            return user;
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
  getById: (IdUsuario, cb) => {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.usuarios.findByPk(IdUsuario).then((user) => {
          return user;
        });
      })
      .then((result) => {
        if (result) {
          console.debug("Resultado despues getUsuario By Id :::: >", result);
          var userCreated = result.dataValues;
          cb(null, userCreated);
        } else {
          cb(null, null);
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  },
  deleteById: (IdUsuario, cb) => {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.usuarios
          .destroy({
            where: { IdUsuario: IdUsuario }
          })
          .then((deleted) => {
            return deleted;
          });
      })
      .then((result) => {
        console.log("Resultado despues Eliminar usuario :::: >", result);
        cb(null, result);
      })
      .catch((err) => {
        cb(err, null);
      });
  },
  findOneByFilter: (filter, cb) => {
    // Find all users
    return models.sequelize
      .transaction((t1) => {
        return models.usuarios
          .findOne({
            where: filter
          })
          .then((usuario) => {
            return usuario;
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
  count: (filterUsuario, filterVehiculo, cb) => {
    return models.sequelize
      .transaction((t1) => {
        return models.usuarios
          .count({
            include: [
              {
                model: models.vehiculo,
                where: filterVehiculo,
                as: "vehiculos"
              }
            ],
            where: filterUsuario,
            distinct: true
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
