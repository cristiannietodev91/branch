var ordenDAO = require('../dao/OrdenDAO');
var citaDAO = require('../dao/citaDAO');
var sms = require('../utils/sendSms')
var HttpStatus = require('http-status-codes');
var moment = require('moment');
var debug = require('debug')('branch:server');


const createOrden = (req, res, next) => {
    try {
        var orden = req.body;
        console.debug('Parametro de orden recibido :::::>', orden);

        if(orden.IdCita){
            citaDAO.getById(orden.IdCita, (error, cita) => {
                if (error) {
                    console.error('Error al realizar la transaccion de crear orden:::>', 'error ::>', error);
                    if (error.errors) {
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                    } else {
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                    }
                } else {
                    if (cita) {
                        let CodigoOrden = orden.CodigoOrden ?  orden.CodigoOrden : moment().format("MMDDYYYYHHMM")+cita.vehiculo.placa
                        let ordenDB = {            //IdVehiculo: vehiculo.IdVehiculo,
                            IdTaller: orden.IdTaller,
                            IdEtapa: orden.IdEtapa,
                            IdCita: orden.IdCita,
                            IdMecanico: orden.IdMecanico,
                            IdVehiculo: cita.IdVehiculo,
                            kilometraje: orden.kilometraje,
                            DocumentosDeja: orden.documentosDeja,
                            CodigoOrden: CodigoOrden,
                            Observaciones: orden.Observaciones,
                            documentos: orden.documentos,
                            estado: orden.estado
                        }

                        if(cita.vehiculo.usuario.celular & orden.IdEtapa == 2){
                            var textoSms = "Su vehiculo "+cita.vehiculo.placa+" ha sido INGRESADO  en el taller BRANCH";
                            sms.sendSMSTwilio(cita.vehiculo.usuario.celular,textoSms);
                            sms.sendNotificacionToUser(cita.vehiculo.usuario.tokenCM,textoSms);
                        }

                        if(cita.vehiculo.usuario.celular & orden.IdEtapa == 3){
                            var textoSms = "Su vehiculo "+cita.vehiculo.placa+" ha sido DIAGNOSTICADO  en el taller BRANCH";
                            sms.sendSMSTwilio(cita.vehiculo.usuario.celular,textoSms);
                            sms.sendNotificacionToUser(cita.vehiculo.usuario.tokenCM,textoSms);
                        }

                        if(cita.vehiculo.usuario.celular & orden.IdEtapa == 4){
                            var textoSms = "Ingrese a BRANCH ya se encuentra disponible la cotización para su vehiculo "+cita.vehiculo.placa;
                            sms.sendSMSTwilio(cita.vehiculo.usuario.celular,textoSms);
                            sms.sendNotificacionToUser(cita.vehiculo.usuario.tokenCM,textoSms);
                        }
    
                        ordenDAO.create(ordenDB, (error, orden) => {
                            if (error) {
                                console.error('Error al realizar la transaccion de crear orden de trabajo:::>', 'error ::>', error);
                                if (error.errors) {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                                } else {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                                }
                            } else {
                                if (orden) {
                                    if(orden.IdEtapa){
                                        cita.estado = 'Cumplida'
                                        citaDAO.update(cita.IdCita,cita,(error,cita)=>{
                                            if (error) {
                                                console.error('Error al realizar la transaccion de crear actualizar cita:::>', 'error ::>', error);
                                                if (error.errors) {
                                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                                                } else {
                                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                                                }
                                            } else {
                                                if (cita) {
                                                    return res.status(HttpStatus.OK).json({ orden});                                
                                                }
                                            }
                                        })
                                    }else{
                                        return res.status(HttpStatus.OK).json({ orden});                                
                                    }
                                    
                                    
                                } else {
                                    return res.status(HttpStatus.OK).json({ error: "No se creo la cita" });
                                }
                            }
                        });                    
                    }
                }
            });
        }else{
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'El valor IdCita es requerido' });    
        }

        
    } catch (error) {
        console.error('Error al crear orden ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateOrden = (req, res, next) => {
    try {
        var IdOrdenTrabajo = req.params.Id;
        var orden = req.body;
        if (IdOrdenTrabajo) {
            
            let ordenDb = {
                IdTaller: orden.IdTaller,
                CodigoOrden: orden.CodigoOrden,
                IdEtapa: orden.IdEtapa,
                IdCita: orden.IdCita,
                IdMecanico: orden.IdMecanico,
                IdVehiculo: orden.IdVehiculo,
                Observaciones: orden.Observaciones,
                estado: orden.estado
            }
            
            ordenDAO.update(IdOrdenTrabajo, ordenDb, function (error, orden) {
                if (error) {
                    console.error('Error al realizar la transaccion de actualizar orden:::>', 'error ::>', error.message);
                    if (error.errors) {
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                    } else {
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                    }
                } else {
                    if (orden) {
                        ordenDAO.getById(IdOrdenTrabajo, (error, orden) => {
                            if (error) {
                                console.error('Error al realizar la transaccion de actualizar orden, getOrdenByID:::>', 'error ::>', error.message);
                                if (error.errors) {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                                } else {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                                }
                            } else {
                                if (orden) {
                                    debug('Datos para envio de SMS ::>', orden.vehiculo.usuario.celular);
                                    /*if (orden.vehiculo.usuario.celular) {
                                        let textoSms = ""
                                        //Texto de cita con mecanico
                                        debug('Estado de la cita ::>', orden.estado);
                                        if(orden.estado == 'Rechazado'){
                                            sms.sendNotificacionToUser(orden.vehiculo.usuario.tokenCM,'Se confirmo su cita exitosamente')
                                        }
                                    }*/
                                }
                            }
                        })
                        return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo la orden ' + IdOrdenTrabajo + ' correctamente' });
                    } else {
                        return res.status(HttpStatus.OK).json({ error: "No se actualizo la cita" });
                    }
                }
            });
            
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "El parametro IdOrdenTrabajo es requerido" });
        }
    } catch (error) {
        console.error('Error al actualizar la OrdenTrabajo ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getAllEtapas = (req, res, next) => {
    try {
        ordenDAO.findAllEtapas(function (error, etapas) {
            if (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.errors[0] });
            } else {
                if (etapas) {
                    res.status(HttpStatus.OK).json(etapas);
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener etapas ::::::>', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}



const getAllOrdenesByIdTaller = (req, res, next) =>{
    try {
        var IdTaller = req.params.Id;

        ordenDAO.findAllByFilter({ IdTaller: IdTaller }, {}, function (error, ordenes) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar ordenes By Taller:::>', 'error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (ordenes) {
                    res.status(HttpStatus.OK).json(ordenes);
                }
            }
        });
    } catch (error) {
        console.error('Error al listar ordenes ::::> ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getOrdenById = (req, res, next) => {
    try {       
        var IdOrden = req.params.Id;
        console.debug('Parametro de IdTaller recibido :::::>',req.params);
        ordenDAO.getById(IdOrden, function (error, orden) {
            if (error) {
                if(error.errors){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                }else{
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }                
            } else {
                if (orden) {
                    return res.status(HttpStatus.OK).json(orden);
                } else {
                    return res.status(HttpStatus.OK).json({});
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar Taller By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


module.exports = {
    createOrden,
    updateOrden,
    getAllEtapas,
    getAllOrdenesByIdTaller,
    getOrdenById
}
