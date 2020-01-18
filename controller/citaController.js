var citaDAO = require('../dao/citaDAO');
var HttpStatus = require('http-status-codes');

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
        citaDAO.create(cita, function (error, cita) {
            if (error) {
                console.error('Error al realizar la transaccion de crear cita:::>', 'error ::>', error);
                if(error.errors){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                }else{
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }                
            } else {
                if (cita) {
                    citaDAO.getById(cita.IdCita, function (error, cita) {
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
                } else {
                    return res.status(HttpStatus.OK).json({ error: "No se creo la cita" });
                }
            }
        });
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



module.exports = {
    getAllCitas,
    createCita,
    updateCita,
    deleteCitaById,
    findCitaById
}
