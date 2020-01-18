const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.Marca.findAll().then(marcas => {
            cb(null, marcas);
        });
    },
    create: function (marca, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Marca.create(marca).then(marca => {
                return marca;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado transaccion crear marca :::: >', result);
                var marcaCreated = result.dataValues;
                cb(null, marcaCreated);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (IdMarca, marca, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Marca.update(marca, {
                where: { IdMarca: IdMarca }
            }).then(marca => {
                return marca;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues de actualizar marca :::: >', result);
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdMarca, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Marca.findByPk(IdMarca).then(marca => {
                return marca;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues getMarca By Id :::: >', result);
                var marcaCreated = result.dataValues;
                cb(null, marcaCreated);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdMarca, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Marca.destroy({
                where: { IdMarca: IdMarca }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            console.log('Resultado despues Eliminar marca :::: >', result);
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    }
}