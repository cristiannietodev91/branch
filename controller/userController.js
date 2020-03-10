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
        var usuario = {
            email: usuario.email,
            password: usuario.password,
            fullname: usuario.fullname,
            celular: usuario.celular,
            identificacion: usuario.identificacion,
            tipoUsuario: usuario.tipoUsuario
        }

        createUsuarioNew(usuario, function (error, usuarioResult) {
            if (error) {
                return res.status(HttpStatus.METHOD_FAILURE).send({ message: error.message });
            } else {
                if (usuarioResult) {
                    res.status(HttpStatus.OK).json(usuarioResult);
                }
            }

        })
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


const loginUserTallerByUID = (req, res, next) => {
    try {
        var uid = req.params.uid;
        console.debug('Parametro taller recibido :::::>', req.query);

        usersDAO.findOneByFilter({ uid: uid }, function (error, usuario) {
            if (error) {
                console.error('Error al realizar la transaccion de buscar usuario por UID error ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            } else {
                if (usuario) {

                    if(usuario.IdTaller){
                        res.status(HttpStatus.OK).json(usuario);
                    }else{
                        res.status(HttpStatus.PRECONDITION_FAILED).json({error: 'Usuario no tiene acceso a ningun taller'});
                    }
                    
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar usuario By UID ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const createUsuarioNew = (usuario, cb) => {
    admin.auth().createUser({
        email: usuario.email,
        emailVerified: false,
        phoneNumber: usuario.celular,
        password: usuario.password,
        displayName: usuario.fullname,
        disabled: false
    }).then(function (userRecord) {

        var usuarioDb = {
            firstName: userRecord.displayName,
            email: userRecord.email,
            uid: userRecord.uid,
            celular: userRecord.phoneNumber,
            identificacion: usuario.identificacion,
            tipoUsuario: usuario.tipoUsuario,
            estado: 'Pendiente'
        }
        usersDAO.create(usuarioDb, function (error, usuario) {
            if (error) {
                cb(error, null);
            } else {
                if (usuario) {
                    cb(null, usuario);
                } else {
                    cb({ message: "No se creo el usuario" }, null)
                }
            }
        });
    }).catch(function (error) {
        cb(error, null);
    });
}


module.exports = {
    getAllUsuarios,
    createFireBaseUsuario,
    updateUsuario,
    deleteUsuarioById,
    findUsuarioById,
    createUsuarioNew,
    loginUserTallerByUID
}
