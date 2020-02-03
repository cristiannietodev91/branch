var tallerDAO = require('../dao/tallerDAO');
var HttpStatus = require('http-status-codes');

const getAllTalleres = (req, res, next) => {
    try {
        tallerDAO.findAll(function (error, talleres) {
            if (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.errors[0] });
            } else {
                if (talleres) {
                    res.status(HttpStatus.OK).json(talleres);
                }
            }
        });
    } catch (error) {
        console.error('Error al crear taller ::::::>', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createTaller = (req, res, next) => {
    try {
        var taller = req.body;
        console.debug('Parametro de taller recibido :::::>', taller);
        taller.estado = "registrado";
        tallerDAO.create(taller, function (error, taller) {
            if (error) {
                console.error('Error al realizar la transaccion de crear taller:::>', 'error ::>', error);
                if(error.errors){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                }else{
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }         
            } else {
                if (taller) {
                    tallerDAO.getById(taller.IdTaller, function (error, taller) {
                        if (error) {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                        } else {
                            if (taller) {
                                return res.status(HttpStatus.OK).json(taller);
                            } else {
                                return res.status(HttpStatus.OK).json({});
                            }
                        }
                    });
                } else {
                    return res.status(HttpStatus.OK).json({ error: "No se creo el taller" });
                }
            }
        });
    } catch (error) {
        console.error('Error al crear taller ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateTaller = (req, res, next) => {
    try {
        var IdTaller = req.params.Id;
        var taller = req.body;
        if (IdTaller) {
            tallerDAO.update(IdTaller, taller, function (error, taller) {
                if (error) {
                    console.error('Error al realizar la transaccion de actualizar taller:::>', 'error ::>', error.message);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    if (taller) {
                        return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo el Taller ' + IdTaller + ' correctamente' });                        
                    } else {
                        return res.status(HttpStatus.OK).json({ error: "No se actualizo el taller" });
                    }
                }
            });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "El parametro IdTaller es requerido" });
        }
    } catch (error) {
        console.error('Error al actualizar taller ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const deleteTallerById = (req, res, next) => {
    try {
        var IdTaller = req.params.Id;
        console.debug('Parametro de IdTaller recibido :::::>', IdTaller);
        tallerDAO.deleteById(IdTaller, function (error, result) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (result) {
                    return res.status(HttpStatus.ACCEPTED).json({ message: 'Se elimino el IdTaller ' + IdTaller + ' correctamente' });
                } else {
                    return res.status(HttpStatus.OK).json({ message: 'Id no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error('Error al borrar Taller By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const findTallerById = (req, res, next) => {
    try {       
        var IdTaller = req.params.Id;
        console.debug('Parametro de IdTaller recibido :::::>',req.params);
        tallerDAO.getById(IdTaller, function (error, taller) {
            if (error) {
                console.error('Error al realizar la transaccion de get taller:::>', 'error ::>', error);
                if(error.errors){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                }else{
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }                
            } else {
                if (taller) {
                    console.debug('Resultado de buscar taller por ID ::::>',IdTaller)
                    return res.status(HttpStatus.OK).json(taller);
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
    getAllTalleres,
    createTaller,
    updateTaller,
    deleteTallerById,
    findTallerById
}
