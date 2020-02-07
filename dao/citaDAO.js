const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.Cita.findAll().then(citas => {
            cb(null, citas);
        });
    },
    create: function (cita, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Cita.create(cita).then(cita => {
                return cita;
            });
        }).then(function (result) {
            if (result) {
                //console.debug('Resultado transaccion crear cita :::: >', result);
                var citaCreated = result.dataValues;
                cb(null, citaCreated);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (IdCita, cita, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Cita.update(cita, {
                where: { IdCita: IdCita }
            }).then(cita => {
                return cita;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues de actualizar cita :::: >', result);
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdCita, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Cita.findByPk(IdCita).then(cita => {
                return cita;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues getCita By Id :::: >', result);
                var citaCreated = result.dataValues;
                cb(null, citaCreated);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdCita, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Cita.destroy({
                where: { IdCita: IdCita }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            console.log('Resultado despues Eliminar cita :::: >', result);
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    },
    findAllByFilter: function (filter, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Cita.findAll({
                include: [
                    {
                        model: models.Vehiculo
                    }
                ],
                where: filter
            }).then(citas => {
                return citas;
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