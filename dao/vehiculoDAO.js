const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.vehiculo.findAll().then(vehiculos => {
            cb(null, vehiculos);
        });
    },
    create: function (vehiculo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.vehiculo.create(vehiculo).then(vehiculo => {
                return vehiculo;
            });
        }).then(function (result) {
            if (result) {
                //console.debug('Resultado transaccion crear vehiculo :::: >', result);
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
            return models.vehiculo.update(vehiculo, {
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
            return models.vehiculo.findByPk(IdVehiculo).then(vehiculo => {
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
            return models.vehiculo.destroy({
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
    },
    findAllByFilter: function (filter,cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.vehiculo.findAll({
                include:[
                    {
                        model: models.Marca
                    },
                    {
                        model: models.Usuarios
                    }
                ],
                
                where: filter
            }).then(vehiculos => {
                return vehiculos;
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