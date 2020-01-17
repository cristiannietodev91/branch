const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.Usuarios.findAll().then(users => {
            cb(null, users);
        });
    },
    create: function (usuario, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Usuarios.create(usuario).then(user => {
                return user;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues usuario :::: >', result);
                var userCreated = result.dataValues;
                cb(null, userCreated);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (Idusuario, usuario, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Usuarios.update(usuario, {
                where: { IdUsuario: Idusuario }
            }).then(user => {
                return user;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues de actualizar usuario :::: >', result);
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdUsuario, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Usuarios.findByPk(IdUsuario).then(user => {
                return user;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues getUsuario By Id :::: >', result);
                var userCreated = result.dataValues;
                cb(null, userCreated);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdUsuario, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Usuarios.destroy({
                where: { IdUsuario: IdUsuario }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            console.log('Resultado despues Eliminar usuario :::: >', result);
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    }
}