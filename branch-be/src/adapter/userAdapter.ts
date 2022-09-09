import usersDAO from "../dao/usersDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import {
  UserInstance,
  VehiculoFilter,
  UserCreationAttributes,
  UserAttributes,
} from "../types";
import admin from "firebase-admin";
import Debug from "debug";
const debug = Debug("branch:server");

import serviceAccountDev from "../../serviceAccountKey.json";
import serviceAccountProd from "../../serviceAccountKeyProd.json";
import { WhereOptions } from "sequelize";

const devServiceConf = {
  credential: admin.credential.cert(serviceAccountDev),
  databaseURL: "https://branch-263701.firebaseio.com",
};

const prodServiceConf = {
  credential: admin.credential.cert(serviceAccountProd),
  databaseURL: "https://branchprod-a9bec.firebaseio.com",
};

admin.initializeApp(
  process.env.NODE_ENV === "production" ? prodServiceConf : devServiceConf
);

const getById = (
  IdUsuario: string | number
): Promise<UserInstance | null> | undefined => usersDAO.getById(IdUsuario);

const findAllUsers = (): Promise<UserInstance[]> => usersDAO.findAll();

const findOneUserByFilter = (
  filter: WhereOptions<UserAttributes> | undefined
): Promise<UserInstance | null> | undefined => usersDAO.findOneByFilter(filter);

const countUsuariosByIdTaller = (
  filter: VehiculoFilter
): Promise<number> | undefined => usersDAO.count({}, filter);

const deleteById = (IdUsuario: string | number): Promise<number> | undefined =>
  usersDAO.deleteById(IdUsuario);

const createUsuario = (
  usuario: UserCreationAttributes
): Promise<UserInstance> | undefined => {
  // Busca si ya existe el usuario en firebase
  return new Promise<UserInstance>((resolve, reject) => {
    if (usuario.uid) {
      const usuarioDb = {
        firstName: usuario.firstName,
        email: usuario.email,
        uid: usuario.uid,
        celular: usuario.celular,
        identificacion: usuario.identificacion ? usuario.identificacion : null,
        tipoUsuario: usuario.tipoUsuario,
        estado: "Pendiente" as const,
        typeDevice: usuario.typeDevice,
      };
      debug("Usuario a registrar en la DB", usuarioDb);
      usersDAO
        .create(usuarioDb)
        ?.then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      if (usuario.identificacion) {
        usersDAO
          .findOneByFilter({ identificacion: usuario.identificacion })
          ?.then((userFound) => {
            if (userFound) {
              reject(
                new Error(
                  "Usuario con ese número de identificacion ya esta registrado"
                )
              );
            } else {
              // Si no existe el usuario en firebase lo crea
              try {
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
                  .then((userRecord) => {
                    // Busca si existe ya el usuario en la BD de usuarios
                    usersDAO
                      .findOneByFilter({ email: usuario.email })
                      ?.then((usuarioemail) => {
                        if (usuarioemail) {
                          // Se obtiene el id usuario del usuario ya existente para actualizarle los datos
                          const { IdUsuario } = usuarioemail;
                          const usuarioToUdp = {
                            firstName: userRecord.displayName,
                            email: userRecord.email,
                            uid: userRecord.uid,
                            celular: userRecord.phoneNumber,
                            identificacion: usuario.identificacion,
                            tipoUsuario: usuario.tipoUsuario,
                            typeDevice: usuario.typeDevice,
                          };

                          updateUsuarioByIdUsuario(IdUsuario, usuarioToUdp);

                          resolve(usuarioemail);
                        } else {
                          const usuarioDb = {
                            firstName: userRecord.displayName || "Not defined",
                            email: userRecord.email || "Not defined",
                            uid: userRecord.uid,
                            celular: userRecord.phoneNumber,
                            identificacion: usuario.identificacion,
                            tipoUsuario: usuario.tipoUsuario,
                            estado: "Pendiente" as const,
                            typeDevice: usuario.typeDevice,
                          };

                          usersDAO
                            .create(usuarioDb)
                            ?.then((user) => {
                              resolve(user);
                            })
                            .catch((error) => {
                              reject(error);
                            });
                        }
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } catch (error) {
                reject(error);
              }
            }
          });
      } else {
        const usuarioDb = {
          firstName: usuario.firstName,
          email: usuario.email,
          uid: usuario.email, // Se deja el email de UID mientras el usuario no este registrado en la APP
          celular: usuario.celular,
          tipoUsuario: usuario.tipoUsuario,
          estado: "Pendiente" as const,
          typeDevice: usuario.typeDevice,
        };
        debug("Usuario a registrar en la DB", usuarioDb);
        usersDAO
          .create(usuarioDb)
          ?.then((user) => {
            resolve(user);
          })
          .catch((error) => {
            reject(error);
          });
      }
    }
  });
};

const updateUsuarioByIdUsuario = (
  IdUsuario: number | string,
  usuario: Partial<UserCreationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  if (IdUsuario) {
    vehiculoDAO
      .update({ IdUsuario: usuario.email }, { IdUsuario: usuario.IdUsuario })
      ?.then(() => {
        debug("Se actualizaron los vehiculos");
      })
      .catch(() => {
        debug("Error al actualizar vehiculos asignados a un UID email");
      });

    return usersDAO.update({ IdUsuario }, usuario);
    /* if (error) {
      console.error("Error al actualizar el usuario ::>", error.message);
      if (error.errors) {
        if (error.errors[0].message.includes("must be unique")) {
          cb({
            error: "Ya existe un usuario con ese número de identificacion"
          });
        } else {
          cb(error, null);
        }
      } else {
        cb(error, null);
      };
    } */
  } else {
    return Promise.reject("El parametro IdUsuario es requerido");
  }
};

const updateUsuario = (
  usuario: Partial<UserCreationAttributes>
): Promise<UserInstance> | undefined => {
  if (usuario.uid) {
    admin
      .auth()
      .updateUser(usuario.uid, {
        email: usuario.email,
        phoneNumber: usuario.celular,
        displayName: usuario.firstName,
      })
      .then(() => {
        // See the UserRecord reference doc for the contents of userRecord.
        if (usuario.uid) {
          return admin
            .auth()
            .setCustomUserClaims(usuario.uid, {
              identificacion: usuario.identificacion,
              tipoUsuario: usuario.tipoUsuario,
            })
            .then(() => {
              // The new custom claims will propagate to the user's ID token the
              // next time a new one is issued.
              return usersDAO.update({ uid: usuario.uid }, usuario);
            });
        }
      })
      .catch((error) => {
        debug("Error updating user:", error);
        return Promise.reject(error);
      });
  } else {
    return Promise.reject("El parametro IdUsuario es requerido");
  }
};

export default {
  getById,
  findAllUsers,
  findOneUserByFilter,
  countUsuariosByIdTaller,
  deleteById,
  updateUsuarioByIdUsuario,
  createUsuario,
  updateUsuario,
};
