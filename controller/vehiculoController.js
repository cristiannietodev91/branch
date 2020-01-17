var vehiculoDAO = require('../dao/vehiculoDAO');
var HttpStatus = require('http-status-codes');

const getAllVehiculos = (req, res, next) => {
    try {
        vehiculoDAO.findAll(function (error, vehiculos) {
            if (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.errors[0] });
            } else {
                if (vehiculos) {
                    res.status(HttpStatus.OK).json(vehiculos);
                }
            }
        });
    } catch (error) {
        console.error('Error al crear vehiculo ::::::>', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createVehiculo = (req, res, next) => {
    try {
        var vehiculo = req.body;
        console.debug('Parametro de vehiculo recibido :::::>', vehiculo);
        vehiculoDAO.create(vehiculo, function (error, vehiculo) {
            if (error) {
                console.error('Error al realizar la transaccion de crear vehiculo:::>', 'error ::>', error);
                if(error.errors){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                }else{
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }                
            } else {
                if (vehiculo) {
                    vehiculoDAO.getById(vehiculo.IdVehiculo, function (error, vehiculo) {
                        if (error) {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                        } else {
                            if (vehiculo) {
                                return res.status(HttpStatus.OK).json(vehiculo);
                            } else {
                                return res.status(HttpStatus.OK).json({});
                            }
                        }
                    });
                } else {
                    return res.status(HttpStatus.OK).json({ error: "No se creo el vehiculo" });
                }
            }
        });
    } catch (error) {
        console.error('Error al crear vehiculo ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateVehiculo = (req, res, next) => {
    try {
        var IdVehiculo = req.params.Id;
        var vehiculo = req.body;
        if (IdVehiculo) {
            vehiculoDAO.update(IdVehiculo, vehiculo, function (error, vehiculo) {
                if (error) {
                    console.error('Error al realizar la transaccion de actualizar vehiculo:::>', 'error ::>', error.message);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    if (vehiculo) {
                        return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo el Vehiculo ' + IdVehiculo + ' correctamente' });                        
                    } else {
                        return res.status(HttpStatus.OK).json({ error: "No se actualizo el vehiculo" });
                    }
                }
            });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "El parametro IdVehiculo es requerido" });
        }
    } catch (error) {
        console.error('Error al actualizar vehiculo ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const deleteVehiculoById = (req, res, next) => {
    try {
        var IdVehiculo = req.params.Id;
        console.debug('Parametro de IdVehiculo recibido :::::>', IdVehiculo);
        vehiculoDAO.deleteById(IdVehiculo, function (error, result) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (result) {
                    return res.status(HttpStatus.ACCEPTED).json({ message: 'Se elimino el IdVehiculo ' + IdVehiculo + ' correctamente' });
                } else {
                    return res.status(HttpStatus.OK).json({ message: 'Id no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error('Error al borrar Vehiculo By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const findVehiculoById = (req, res, next) => {
    try {
        var IdVehiculo = req.params.Id;
        //console.debug('Parametro de Idusuario recibido :::::>', req.params);
        vehiculoDAO.getById(IdVehiculo, function (error, vehiculo) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (vehiculo) {
                    return res.status(HttpStatus.OK).json(vehiculo);
                } else {
                    return res.status(HttpStatus.OK).json({});
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar Vehiculo By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}



module.exports = {
    getAllVehiculos,
    createVehiculo,
    updateVehiculo,
    deleteVehiculoById,
    findVehiculoById
}
