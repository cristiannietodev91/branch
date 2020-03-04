const models = require("../database/models");

module.exports = {
    findAll: function (cb) {
        // Find all users
        models.ordentrabajo.findAll().then(ordenes => {
            cb(null, ordenes);
        });
    },
    findAllEtapas: function (cb) {
        // Find all users
        models.etapa.findAll().then(etapas => {
            cb(null, etapas);
        });
    },
    create: function (orden, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.ordentrabajo.create(orden).then(orden => {
                return orden;
            });
        }).then(function (result) {
            if (result) {
                //console.debug('Resultado transaccion crear cita :::: >', result);
                cb(null, result.dataValues);
            } else {
                cb(null, null);
            }

        }).catch(function (err) {
            cb(err, null);
        });
    },
    update: function (IdOrdenTrabajo, orden, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.ordentrabajo.update(orden, {
                where: { IdOrdenTrabajo: IdOrdenTrabajo }
            }).then(orden => {
                return orden;
            });
        }).then(function (result) {
            if (result) {
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    getById: function (IdOrdenTrabajo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.ordentrabajo.findByPk(IdOrdenTrabajo,{
                include: [
                    {
                        model: models.mecanico
                    }
                ]
            }).then(orden => {
                return orden;
            });
        }).then(function (result) {
            if (result) {
                cb(null, result.dataValues);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    },
    deleteById: function (IdOrdenTrabajo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.ordentrabajo.destroy({
                where: { IdOrdenTrabajo: IdOrdenTrabajo }
            }).then(deleted => {
                return deleted;
            });
        }).then(function (result) {
            cb(null, result);
        }).catch(function (err) {
            cb(err, null);
        });
    },
    findAllByFilter: function (filterOrden,filterVehiculo, cb) {
        // Find all users
        return models.sequelize.transaction((t1) => {
            return models.ordentrabajo.findAll({
                include: [
                    {
                        model: models.vehiculo,
                        where: filterVehiculo,
                        include: [
                            {
                                model: models.marca
                            }
                        ]                        
                    },
                    {
                        model: models.taller
                    },
                    {
                        model: models.mecanico
                    },
                    {
                        model: models.etapa
                    }
                ],
                where: filterOrden,
                order: [
                    ['CodigoOrden'],
                    ['createdAt','DESC'],
                ]
            }).then(ordenes => {
                return ordenes;
            });
        }).then(function (result) {
            if (result) {
                cb(null, result);
            } else {
                cb(null, null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    }
}