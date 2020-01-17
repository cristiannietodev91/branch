const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.Vehiculo.findAll().then(vehiculos => {
            cb(null, vehiculos);
        });
    },
    create: function (vehiculo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Vehiculo.create(vehiculo).then(vehiculo => {
                return vehiculo;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado transaccion crear vehiculo :::: >', result);
                var vehiculoCreated = result.dataValues;
                cb(null, vehiculoCreated);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (IdVehiculo, vehiculo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Vehiculo.update(vehiculo, {
                where: { IdVehiculo: IdVehiculo }
            }).then(vehiculo => {
                return vehiculo;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues de actualizar vehiculo :::: >', result);
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdVehiculo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Vehiculo.findByPk(IdVehiculo).then(vehiculo => {
                return vehiculo;
            });
        }).then(function (result) {
            if (result) {
                console.debug('Resultado despues getvehiculo By Id :::: >', result);
                var vehiculoCreated = result.dataValues;
                cb(null, vehiculoCreated);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdVehiculo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.Vehiculo.destroy({
                where: { IdVehiculo: IdVehiculo }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            console.log('Resultado despues Eliminar vehiculo :::: >', result);
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    }
}