var citaDAO = require('../dao/citaDAO');
var vehiculoDAO = require('../dao/vehiculoDAO');
var sms = require('../utils/sendSms')
var HttpStatus = require('http-status-codes');
var moment = require('moment');

const getAllCitas = (req, res, next) => {
    try {
        citaDAO.findAll(function (error, citas) {
            if (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.errors[0] });
            } else {
                if (citas) {
                    res.status(HttpStatus.OK).json(citas);
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener cita ::::::>', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createCita = (req, res, next) => {
    try {
        var cita = req.body;
        console.debug('Parametro de cita recibido :::::>', cita);

        vehiculoDAO.findOneByFilter({ placa: cita.placa, IdTaller: cita.taller }, function (error, vehiculo) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar vehiculo por placa:::>', 'error ::>', error);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (vehiculo) {
                    var citaDb = {
                        IdVehiculo: vehiculo.IdVehiculo,
                        IdTaller: cita.taller,
                        IdMecanico: cita.mecanico,
                        fechaCita: cita.fechaCita,
                        horaCita: cita.horaCita,
                        estado: 'Confirmada'
                    }
                    console.log('Cita a persistir en la BD', citaDb);
                    citaDAO.create(citaDb, function (error, cita) {
                        if (error) {
                            console.error('Error al realizar la transaccion de crear cita:::>', 'error ::>', error);
                            if (error.errors) {
                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                            } else {
                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                            }
                        } else {
                            if (cita) {

                                /*if(vehiculo.usuario.celular){
                                    var textoSms = "Se ha agendado una cita para el vehiculo "+vehiculo.placa+" el dia " +cita.fechaCita +" en el taller BRANCH";
                                    sms.sendSMSTwilio(vehiculo.usuario.celular,textoSms);
                                }*/

                                return res.status(HttpStatus.OK).json(cita);
                                /*citaDAO.getById(cita.IdCita, function (error, cita) {
                                    if (error) {
                                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                                    } else {
                                        if (cita) {
                                            
                                        } else {
                                            return res.status(HttpStatus.OK).json({});
                                        }
                                    }
                                });*/
                            } else {
                                return res.status(HttpStatus.OK).json({ error: "No se creo la cita" });
                            }
                        }
                    });

                } else {
                    return res.status(HttpStatus.PRECONDITION_REQUIRED).send({ error: 'No se encontro un vehiculo con la placa ' + cita.placa });
                }
            }
        })
    } catch (error) {
        console.error('Error al crear cita ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateCita = (req, res, next) => {
    try {
        var IdCita = req.params.Id;
        var cita = req.body;
        if (IdCita) {
            citaDAO.update(IdCita, cita, function (error, cita) {
                if (error) {
                    console.error('Error al realizar la transaccion de actualizar cita:::>', 'error ::>', error.message);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    if (cita) {
                        return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo la cita ' + IdCita + ' correctamente' });
                    } else {
                        return res.status(HttpStatus.OK).json({ error: "No se actualizo la cita" });
                    }
                }
            });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "El parametro IdCita es requerido" });
        }
    } catch (error) {
        console.error('Error al actualizar la cita ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const deleteCitaById = (req, res, next) => {
    try {
        var IdCita = req.params.Id;
        console.debug('Parametro de IdCita recibido :::::>', IdCita);
        citaDAO.deleteById(IdCita, function (error, result) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (result) {
                    return res.status(HttpStatus.ACCEPTED).json({ message: 'Se elimino la IdCita ' + IdCita + ' correctamente' });
                } else {
                    return res.status(HttpStatus.OK).json({ message: 'Id no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error('Error al borrar Cita By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const findCitaById = (req, res, next) => {
    try {
        var IdCita = req.params.Id;
        //console.debug('Parametro de Idusuario recibido :::::>', req.params);
        citaDAO.getById(IdCita, function (error, cita) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (cita) {
                    return res.status(HttpStatus.OK).json(cita);
                } else {
                    return res.status(HttpStatus.OK).json({});
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar Cita By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getAllCitasByIdTaller = (req, res, next) => {
    try {
        var IdTaller = req.params.Id;

        citaDAO.findAllByFilter({ IdTaller: IdTaller }, {}, function (error, citas) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar citas:::>', 'error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (citas) {
                    var events = castCitasToEvents(citas);
                    res.status(HttpStatus.OK).json(events);
                }
            }
        });
    } catch (error) {
        console.error('Error al listar citas ::::> ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getAllCitasByIdUsuario = (req, res, next) => {
    try {
        var IdUsuario = req.params.Id;

        citaDAO.findAllByFilter({}, { IdUsuario: IdUsuario }, function (error, citas) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar citas:::>', 'error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (citas) {
                    res.status(HttpStatus.OK).json(citas);
                }
            }
        });
    } catch (error) {
        console.error('Error al listar citas ::::> ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const castCitasToEvents = (citas) => {
    let events = [];
    citas.forEach(cita => {
        var dataCita = cita.dataValues;        
        let hour = 0;
        if (cita.dataValues.horaCita) {
            hour = moment(cita.dataValues.horaCita, 'HH:mm:ss');             
        } else {
            hour = moment('00:00:00', 'HH:mm:ss');;           
        }

        console.log('Hora format :::>',hour);

        let myDate = new Date(Date.UTC(dataCita.fechaCita.getFullYear(), dataCita.fechaCita.getMonth(), dataCita.fechaCita.getDate(), hour.hour(), hour.minute(), 0));
        

        let event = {
            id: dataCita.IdCita,
            startDate: myDate,
            title: 'Cita vehiculo =>' + dataCita.vehiculo.placa,
            classes: dataCita.estado == 'Con orden'? 'event-orden' : 'event-default'
        }
        events.push(event);
    });
    return events
}



module.exports = {
    getAllCitas,
    createCita,
    updateCita,
    deleteCitaById,
    findCitaById,
    getAllCitasByIdTaller,
    getAllCitasByIdUsuario
}
