const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.marca.findAll().then(marcas => {
            cb(null, marcas);
        });
    },
    findAllUnique: function (cb) {
        // Find all users
        models.marca.findAll({
            attributes: ['marca'],
            group: ['marca']
        }).then(marcas => {
            cb(null, marcas);
        });
    },
    create: function (marca, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.marca.create(marca).then(marca => {
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
            return models.marca.update(marca, {
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
            return models.marca.findByPk(IdMarca).then(marca => {
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
            return models.marca.destroy({
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
    },
    findAllByFilter: function (filterMarca, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.marca.findAll({
                where: filterMarca
            }).then(marcas => {
                return marcas;
            });
        }).then(function (result) {
            if (result) {
                //console.debug('Resultado despues listar vehiculos By Filter :::: >',filter,' Result ::::> ', result);                
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    }
}