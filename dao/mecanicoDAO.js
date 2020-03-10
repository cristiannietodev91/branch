const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.mecanico.findAll().then(mecanicos => {
            cb(null, mecanicos);
        });
    },
    create: function (mecanico, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.mecanico.create(mecanico).then(async createdmecanico => {
                await createdmecanico.addTallers([mecanico.taller.IdTaller]);
                return createdmecanico;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado transaccion crear mecanico :::: >', result);
                var mecanicoCreated = result.dataValues;
                cb(null, mecanicoCreated);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (IdMecanico, mecanico, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.mecanico.update(mecanico, {
                where: { IdMecanico: IdMecanico }
            }).then(mecanico => {
                return mecanico;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues de actualizar mecanico :::: >', result);
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdMecanico, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.mecanico.findByPk(IdMecanico).then(mecanico => {
                return mecanico;
            });
        }).then(function (result) {
            if (result) {
                var mecanicoCreated = result.dataValues;
                cb(null, mecanicoCreated);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdMecanico, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.mecanico.destroy({
                where: { IdMecanico: IdMecanico }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            console.log('Resultado despues Eliminar mecanico :::: >', result);
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    }
}