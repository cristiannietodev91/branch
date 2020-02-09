const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.taller.findAll().then(talleres => {
            cb(null, talleres);
        });
    },
    create: function (taller, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.taller.create(taller).then(taller => {
                return taller;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado transaccion crear taller :::: >', result);
                var tallerCreated = result.dataValues;
                cb(null, tallerCreated);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (IdTaller, taller, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.taller.update(taller, {
                where: { IdTaller: IdTaller }
            }).then(taller => {
                return taller;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues de actualizar taller :::: >', result);
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdTaller, cb) {
        return models.sequelize.transaction((t1) => {
            return models.taller.findByPk(IdTaller, {
                include:
                {
                    model: models.mecanico
                }
            }).then(taller => {
                return taller;
            });
        }).then(function (result) {
            if (result) {
                //console.debug('Resultado despues getTaller By Id :::: >', result);
                var tallerCreated = result.dataValues;
                cb(null, tallerCreated);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdTaller, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.taller.destroy({
                where: { IdTaller: IdTaller }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            console.log('Resultado despues Eliminar taller :::: >', result);
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    }
}