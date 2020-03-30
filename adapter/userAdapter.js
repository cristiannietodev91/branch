let usersDAO = require('../dao/usersDAO');
let admin = require('firebase-admin');

let serviceAccount = require("../serviceAccountKey.json");

let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://branch-263701.firebaseio.com'
});

const findUserByEmail = (email,cb) => {
    usersDAO.findOneByFilter({email: email}, (error,usuario)=>{
        if(error){
            cb(error,null)
        }else{
            cb(null,usuario);
        }
    })
}

const createUsuarioNew = (usuario, cb) => {
    
    //Busca si ya existe el usuario en firebase
    if(usuario.uid){
        let usuarioDb = {
            firstName: usuario.firstName,
            email: usuario.email,
            uid: usuario.uid,
            celular: usuario.celular,
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
    }else{
        //Si no existe el usuario en firebase lo crea
        admin.auth().createUser({
            email: usuario.email,
            emailVerified: false,
            phoneNumber: usuario.celular,
            password: usuario.password,
            displayName: usuario.firstName,
            disabled: false
        }).then(function (userRecord) {
    
            let usuarioDb = {
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

    
}

module.exports = {
    findUserByEmail,
    createUsuarioNew
}