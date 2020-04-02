let usersDAO = require('../dao/usersDAO');
let HttpStatus = require('http-status-codes');

let userAdapater = require('../adapter/userAdapter');


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
        let usuario = req.body;
        console.debug('Parametro de usuario recibido :::::>', usuario);

        let usuarioDB = {
            email: usuario.email,
            password: usuario.password,
            firstName: usuario.firstName,
            celular: usuario.celular,
            identificacion: usuario.identificacion,
            tipoUsuario: usuario.tipoUsuario,
            uid: usuario.uid
        }

        userAdapater.createUsuario(usuarioDB, function (error, usuarioResult) {
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


const updateUsuarioByUid = (req, res, next) => {
    try {
        let uid = req.params.uid;
        let usuario = req.body;

        console.debug(' Usuario recibido para actualizar :::>', usuario);
        let usuarioDB = {
            email: usuario.email,
            password: usuario.password,
            firstName: usuario.firstName,
            celular: usuario.celular,
            identificacion: usuario.identificacion,
            tipoUsuario: usuario.tipoUsuario,
            uid: uid
        }

        userAdapater.updateUsuario(usuarioDB,(error,usuario)=>{
            if(error){
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.error });
            }else{
                if(usuario){
                    return res.status(HttpStatus.ACCEPTED).json({ message: 'Se actualizo el IdUsuario ' + uid + ' correctamente' });
                }
            }
        })        
        
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

                    if (usuario.IdTaller) {
                        res.status(HttpStatus.OK).json(usuario);
                    } else {
                        res.status(HttpStatus.PRECONDITION_FAILED).json({ error: 'Usuario no tiene acceso a ningun taller' });
                    }

                }
            }
        });
    } catch (error) {
        console.error('Error al buscar usuario By UID ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


const findUserByEmail = (req, res , next) => {
    try {
        let email = req.params.email;

        userAdapater.findUserByEmail(email,(error,usuario)=>{
            if(error){
                console.error('Error al buscar usuario por email ::>', error.message);
                if (error.errors) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.errors[0] });
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
                }
            }else{
                if (usuario) {
                    res.status(HttpStatus.OK).json(usuario);                   
                }else{
                    res.status(HttpStatus.OK).json({});
                }
            }
        })
    }catch (error) {
        console.error('Error al buscar usuario By Email ', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}




module.exports = {
    getAllUsuarios,
    createFireBaseUsuario,
    updateUsuarioByUid,
    deleteUsuarioById,
    findUsuarioById,
    loginUserTallerByUID,
    findUserByEmail
}
