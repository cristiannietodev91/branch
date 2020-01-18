var marcaDAO = require('../dao/marcaDAO');
var HttpStatus = require('http-status-codes');

const getAllMarcas = (req, res, next) => {
    try {
        marcaDAO.findAll(function (error, marcas) {
            if (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.errors[0] });
            } else {
                if (marcas) {
                    res.status(HttpStatus.OK).json(marcas);
                }
            }
        });
    } catch (error) {
        console.error('Error al listar marcas ::::::>', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createMarca = (req, res, next) => {
    try {
        var marca = req.body;
        console.debug('Parametro de marca recibido :::::>', marca);
        marcaDAO.create(marca, function (error, marca) {
            if (error) {
                console.error('Error al realizar la transaccion de crear marca:::>', 'error ::>', error);
                if(error.errors){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                }else{
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }                
            } else {
                if (marca) {
                    marcaDAO.getById(marca.IdMarca, function (error, marca) {
                        if (error) {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                        } else {
                            if (marca) {
                                return res.status(HttpStatus.OK).json(marca);
                            } else {
                                return res.status(HttpStatus.OK).json({});
                            }
                        }
                    });
                } else {
                    return res.status(HttpStatus.OK).json({ error: "No se creo la marca" });
                }
            }
        });
    } catch (error) {
        console.error('Error al crear marca ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateMarca = (req, res, next) => {
    try {
        var IdMarca = req.params.Id;
        var marca = req.body;
        if (IdMarca) {
            marcaDAO.update(IdMarca, marca, function (error, marca) {
                if (error) {
                    console.error('Error al realizar la transaccion de actualizar marca:::>', 'error ::>', error.message);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    if (marca) {
                        return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo la marca ' + IdMarca + ' correctamente' });                        
                    } else {
                        return res.status(HttpStatus.OK).json({ error: "No se actualizo la marca" });
                    }
                }
            });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "El parametro IdMarca es requerido" });
        }
    } catch (error) {
        console.error('Error al actualizar marca ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const deleteMarcaById = (req, res, next) => {
    try {
        var IdMarca = req.params.Id;
        console.debug('Parametro de IdMarca recibido :::::>', IdMarca);
        marcaDAO.deleteById(IdMarca, function (error, result) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (result) {
                    return res.status(HttpStatus.ACCEPTED).json({ message: 'Se elimino la IdMarca ' + IdMarca + ' correctamente' });
                } else {
                    return res.status(HttpStatus.OK).json({ message: 'Id no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error('Error al borrar Marca By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const findMarcaById = (req, res, next) => {
    try {
        var IdMarca = req.params.Id;
        //console.debug('Parametro de Idusuario recibido :::::>', req.params);
        marcaDAO.getById(IdMarca, function (error, marca) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (marca) {
                    return res.status(HttpStatus.OK).json(marca);
                } else {
                    return res.status(HttpStatus.OK).json({});
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar Marca By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}



module.exports = {
    getAllMarcas,
    createMarca,
    updateMarca,
    deleteMarcaById,
    findMarcaById
}
