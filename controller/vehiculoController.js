var vehiculoDAO = require('../dao/vehiculoDAO');
var userController = require('../controller/userController');
var sms = require('../utils/sendSms')
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
        vehiculoDAO.findAllByFilter({ placa: vehiculo.placa }, function (error, vehiculos) {
            if (error) {
                console.error('Error al buscar vehiculo por placa:::>', 'error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (vehiculos.lenght > 1) {
                    //TODO : Placa ya existe, si no tiene taller si coloca el ID de taller que esta registrando
                } else {
                    //Se crea un usuario en firebase 
                    if (vehiculo.usuario) {
                        crearVehiculoDB(vehiculo.usuario, vehiculo, function (error, vehiculo) {
                            if (error) {
                                console.error('Error al realizar la transaccion de crear vehiculo con usuario existente:::>', 'error ::>', error);
                                if (error.errors) {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                                }
                                else {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                                }
                            }else{
                                if(vehiculo){
                                    return res.status(HttpStatus.OK).json(vehiculo);
                                }else{
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error indefinido al crear vehiculo' });
                                }
                            }
                        });
                    } else {
                        //TODO: No existe el usuario
                        var usuario = {
                            email: vehiculo.email,
                            celular: '+57' + vehiculo.celular,
                            password: '123456',
                            fullname: 'Sin nombre',
                            tipoUsuario: 'Cliente'
                        }
                        userController.createUsuarioNew(usuario, function (error, userRecord) {
                            if (error) {
                                console.error('Error al realizar la transaccion de crear vehiculo:::>', 'error ::>', error);
                                if (error.errors) {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                                } else {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                                }
                            } else {
                                if (userRecord) {
                                    crearVehiculoDB(userRecord, vehiculo, res);
                                }
                            }

                        });
                    }

                }
            }
        })
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
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
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

const getAllVehiculosByIdTaller = (req, res, next) => {
    try {
        var IdTaller = req.params.Id;
        console.debug('Parametro taller recibido :::::>', req.query);

        vehiculoDAO.findAllByFilter({ IdTaller: IdTaller }, function (error, vehiculos) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar vehiculos:::>', 'error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (vehiculos) {
                    res.status(HttpStatus.OK).json(vehiculos);
                }
            }
        });
    } catch (error) {
        console.error('Error al listar vehiculos ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getAllVehiculosByIdUsuario = (req, res, next) => {
    try {
        var IdUsuario = req.params.Id;
        console.debug('Parametro usuario recibido :::::>', IdUsuario);

        vehiculoDAO.findAllByFilter({ IdUsuario: IdUsuario }, function (error, vehiculos) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar vehiculos:::>', 'error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (vehiculos) {
                    res.status(HttpStatus.OK).json(vehiculos);
                }
            }
        });
    } catch (error) {
        console.error('Error al listar vehiculos ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    getAllVehiculos,
    createVehiculo,
    updateVehiculo,
    deleteVehiculoById,
    findVehiculoById,
    getAllVehiculosByIdTaller,
    getAllVehiculosByIdUsuario
}


function crearVehiculoDB(userRecord, vehiculo, cb) {
    var vehiculoRegister = {
        IdMarca: 1,
        IdUsuario: userRecord.uid,
        IdTaller: vehiculo.IdTaller,
        tipoVehiculo: 'Moto',
        placa: vehiculo.placa,
        estado: 'Pendiente'
    };
    vehiculoDAO.create(vehiculoRegister, function (error, vehiculo) {
        if (error) {
            cb(error, null);
        }
        else {
            if (vehiculo) {
                //Send SMS al usuario al que pertenece el vehiculo para que ingrese a administrar el vehiculo
                if (userRecord.celular) {
                    var textoSms = "Se ha registrado el vehiculo " + vehiculo.placa + " por el taller BRANCH lo invitamos a que se registre en el siguiente link para que disfrute los beneficios BRANCH http://localhost:8080";
                    sms.sendSMSTwilio(userRecord.celular, textoSms);
                }
                cb(null,vehiculo);
            }
            else {
                cb({ error: "No se creo el vehiculo" },null);
            }
        }
    });
}

