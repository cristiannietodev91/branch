import usersDAO from "../dao/usersDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import {
  UserInstance,
  VehiculoFilter,
  UserCreationAttributes,
  UserAttributes,
  UserCreationRequest,
} from "../types";

import Debug from "debug";
const debug = Debug("branch:server");
import admin from "../utils/firebase";
import { WhereOptions } from "sequelize";


const getById = (
  IdUsuario: string | number
): Promise<UserInstance | null> | undefined => usersDAO.getById(IdUsuario);

const findAllUsers = (): Promise<UserInstance[]> => usersDAO.findAll();

const findOneUserByFilter = (
  filter: WhereOptions<UserAttributes> | undefined
): Promise<UserInstance | null> | undefined => usersDAO.findOneByFilter(filter);

const countUsersByIdWorkshop = (
  filter: VehiculoFilter
): Promise<number> | undefined => usersDAO.count({}, filter);

const deleteById = (userId: string | number): Promise<number> | undefined =>
  usersDAO.deleteById(userId);

const createUser = async (
  usuario: UserCreationRequest
): Promise<UserInstance> => {
  const { identificacion } = usuario;

  if (!identificacion || identificacion.trim() === "") {
    throw new Error("Identification is needed to create the user");
  }

  const userFound = await usersDAO.findOneByFilter({ identificacion: usuario.identificacion });

  if (userFound) {
    throw new Error(`User with the identification ${usuario.identificacion} already exits.`);
  }

  const userFirebase = await admin.auth().createUser({
    email: usuario.email,
    emailVerified: false,
    phoneNumber: usuario.celular,
    password: usuario.password,
    displayName: usuario.firstName,
    disabled: false,
  });

  const userByEmail = await usersDAO.findOneByFilter({ email: usuario.email });

  if (userByEmail) {
    const { IdUsuario } = userByEmail;
    const usuarioToUdp = {
      firstName: userFirebase.displayName,
      email: userFirebase.email,
      uid: userFirebase.uid,
      celular: userFirebase.phoneNumber,
      identificacion: usuario.identificacion,
      tipoUsuario: usuario.tipoUsuario,
    };

    updateUsuarioByIdUsuario(IdUsuario, usuarioToUdp);

    return userByEmail;
  }

  const usuarioDb = {
    firstName: userFirebase.displayName || "Not defined",
    email: userFirebase.email || "Not defined",
    uid: userFirebase.uid,
    celular: userFirebase.phoneNumber,
    identificacion: usuario.identificacion,
    tipoUsuario: usuario.tipoUsuario,
    estado: "Pendiente" as const,
  };

  const userCreated = await usersDAO.create(usuarioDb);

  return userCreated;
};

const updateUsuarioByIdUsuario = (
  IdUsuario: number | string,
  usuario: Partial<UserCreationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  if (IdUsuario) {
    vehiculoDAO
      .update({ IdUsuario: usuario.email }, { IdUsuario: usuario.uid })
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
  countUsersByIdWorkshop,
  deleteById,
  updateUsuarioByIdUsuario,
  createUser,
  updateUsuario,
};
