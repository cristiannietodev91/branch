var usersDAO = require('../dao/usersDAO');
var HttpStatus = require('http-status-codes');
var admin = require('firebase-admin');


var serviceAccount = require("../serviceAccountKey.json");

var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://branch-263701.firebaseio.com'
});

/*exports.helloWorld = functions.https.onRequest((request, response) => {
    response.json(app.options);
});*/

const getAllUsuarios = (req, res, next) => {
    try {
        usersDAO.findAll(function (error, users) {
            if (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.errors[0] });
            } else {
                if (users) {
                    res.status(HttpStatus.OK).json(users);
                }
            }
        });
    } catch (error) {
        console.error('Error al crear usuario ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createFireBaseUsuario = async (req, res, next) => {
    try {
        var usuario = req.body;
        console.debug('Parametro de usuario recibido :::::>', usuario);
        admin.auth().getUserByEmail(usuario.email).then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', userRecord.toJSON());
            admin.auth().setCustomUserClaims(userRecord.uid, {
                fullname: usuario.fullname,
                identificacion: usuario.identificacion
            }).then(function () {
                //userRecord.getIdToken(true);
                // Tell client to refresh token on user.
                // Lookup the user associated with the specified uid.
                admin.auth().getUser(userRecord.uid).then((userAct) => {
                    // The claims can be accessed on the user record.
                    console.log('Resultado userClaim :::::>', userAct);
                    res.status(HttpStatus.OK).json(userAct);
                });
                
            });


        })
            .catch(function (error) {
                console.log('Error fetching user data:', error);
                next(error);
            });



    } catch (error) {
        console.error('Error al crear usuario ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createUsuario = (req, res, next) => {
    try {
        var usuario = req.body;
        console.debug('Parametro de usuario recibido :::::>', usuario);
        usersDAO.create(usuario, function (error, usuario) {
            if (error) {
                console.error('Error al realizar la transaccion de crear usuario:::>', 'error ::>', error);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (usuario) {
                    usersDAO.getById(usuario.IdUsuario, function (error, usuario) {
                        if (error) {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                        } else {
                            if (usuario) {
                                return res.status(HttpStatus.OK).json(usuario);
                            } else {
                                return res.status(HttpStatus.OK).json({});
                            }
                        }
                    });
                } else {
                    return res.status(HttpStatus.OK).json({ error: "No se creo el usuario" });
                }
            }
        });
    } catch (error) {
        console.error('Error al crear usuario ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateUsuario = (req, res, next) => {
    try {
        var Idusuario = req.params.Id;
        var usuario = req.body;
        if (Idusuario) {
            usersDAO.update(Idusuario, usuario, function (error, usuario) {
                if (error) {
                    console.error('Error al realizar la transaccion de actualizar usuario:::>', 'error ::>', error.message);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    if (usuario) {
                        return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo el IdUsuario ' + Idusuario + ' correctamente' });
                    } else {
                        return res.status(HttpStatus.OK).json({ error: "No se actualizo el usuario" });
                    }
                }
            });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "El parametro IdUsuario es requerido" });
        }
    } catch (error) {
        console.error('Error al actualizar usuario ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const deleteUsuarioById = (req, res, next) => {
    try {
        var Idusuario = req.params.Id;
        console.debug('Parametro de Idusuario recibido :::::>', Idusuario);
        usersDAO.deleteById(Idusuario, function (error, result) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (result) {
                    return res.status(HttpStatus.ACCEPTED).json({ message: 'Se elimino el IdUsuario ' + Idusuario + ' correctamente' });
                } else {
                    return res.status(HttpStatus.OK).json({ message: 'Id no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error('Error al borrar Usuario By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const findUsuarioById = (req, res, next) => {
    try {
        var Idusuario = req.params.Id;
        //console.debug('Parametro de Idusuario recibido :::::>', req.params);
        usersDAO.getById(Idusuario, function (error, usuario) {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
            } else {
                if (usuario) {
                    return res.status(HttpStatus.OK).json(usuario);
                } else {
                    return res.status(HttpStatus.OK).json({});
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar Usuario By Id ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}



module.exports = {
    getAllUsuarios,
    createUsuario,
    createFireBaseUsuario,
    updateUsuario,
    deleteUsuarioById,
    findUsuarioById
}
