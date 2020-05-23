let usersDAO = require("../dao/usersDAO");
let admin = require("firebase-admin");

let serviceAccount = require("../serviceAccountKey.json");

let app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://branch-263701.firebaseio.com",
});

const findUserByEmail = (email, cb) => {
  usersDAO.findOneByFilter({ email: email }, (error, usuario) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, usuario);
    }
  });
};

const createUsuario = (usuario, cb) => {
  //Busca si ya existe el usuario en firebase
  if (usuario.uid) {
    let usuarioDb = {
      firstName: usuario.firstName,
      email: usuario.email,
      uid: usuario.uid,
      celular: usuario.celular,
      identificacion: usuario.identificacion,
      tipoUsuario: usuario.tipoUsuario,
      estado: "Pendiente",
    };
    usersDAO.create(usuarioDb, function (error, usuario) {
      if (error) {
        cb(error, null);
      } else {
        if (usuario) {
          cb(null, usuario);
        } else {
          cb({ message: "No se creo el usuario" }, null);
        }
      }
    });
  } else {
    usersDAO.findOneByFilter(
      { identificacion: usuario.identificacion },
      (error, existusuario) => {
        if (error) {
          console.log("Error en la creacion del usuario", error);
        } else {
          if (existusuario) {
            cb(
              {
                message:
                  "Usuario con ese número de identificacion ya esta registrado",
              },
              null
            );
          } else {
            //Si no existe el usuario en firebase lo crea
            admin
              .auth()
              .createUser({
                email: usuario.email,
                emailVerified: false,
                phoneNumber: usuario.celular,
                password: usuario.password,
                displayName: usuario.firstName,
                disabled: false,
              })
              .then(function (userRecord) {
                let usuarioDb = {
                  firstName: userRecord.displayName,
                  email: userRecord.email,
                  uid: userRecord.uid,
                  celular: userRecord.phoneNumber,
                  identificacion: usuario.identificacion,
                  tipoUsuario: usuario.tipoUsuario,
                  estado: "Pendiente",
                };
                usersDAO.create(usuarioDb, function (error, usuario) {
                  if (error) {
                    cb(error, null);
                  } else {
                    if (usuario) {
                      cb(null, usuario);
                    } else {
                      cb({ message: "No se creo el usuario" }, null);
                    }
                  }
                });
              })
              .catch(function (error) {
                cb(error, null);
              });
          }
        }
      }
    );
  }
};

const updateUsuario = (usuario, cb) => {
  if (usuario.uid) {
    admin
      .auth()
      .updateUser(usuario.uid, {
        email: usuario.email,
        phoneNumber: usuario.celular,
        displayName: usuario.firstName,
      })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        admin
          .auth()
          .setCustomUserClaims(usuario.uid, {
            identificacion: usuario.identificacion,
            tipoUsuario: usuario.tipoUsuario,
          })
          .then(() => {
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
            console.log("Successfully updated user", userRecord.toJSON());
            usersDAO.update({ uid: usuario.uid }, usuario, function (
              error,
              usuario
            ) {
              if (error) {
                console.error(
                  "Error al actualizar el usuario ::>",
                  error.message
                );
                if (error.errors) {
                  if (error.errors[0].message.includes("must be unique")) {
                    cb({
                      error:
                        "Ya existe un usuario con ese número de identificacion",
                    });
                  } else {
                    cb(error, null);
                  }
                } else {
                  cb(error, null);
                }
                11;
              } else {
                if (usuario) {
                  cb(null, usuario);
                } else {
                  cb({ error: "No se actualizo el usuario" }, null);
                }
              }
            });
          });
      })
      .catch(function (error) {
        console.log("Error updating user:", error);
        cb(error, null);
      });
  } else {
    cb({ error: "El parametro IdUsuario es requerido" }, null);
  }
};

module.exports = {
  findUserByEmail,
  createUsuario,
  updateUsuario,
};
