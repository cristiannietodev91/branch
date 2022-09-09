import HttpStatus from "http-status-codes";
import userAdapater from "../adapter/userAdapter";
import { Request, Response } from "express";
import Debug from "debug";
import { UserCreationAttributes } from "../types";
import { ValidationError } from "sequelize";
const debug = Debug("branch:server");

const getAllUsuarios = (req: Request, res: Response): void => {
  userAdapater
    .findAllUsers()
    .then((users) => {
      res.status(HttpStatus.OK).json(users);
    })
    .catch((error) => {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    });
};

const findUserByEmail = (req: Request, res: Response): void => {
  try {
    const email = req.params.email;

    userAdapater
      .findOneUserByFilter({ email })
      ?.then((usuario) => {
        if (usuario) {
          res.status(HttpStatus.OK).json(usuario);
        } else {
          res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        if (error) {
          debug("Error al buscar usuario por email ::>", error.message);
          if (error.errors) {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        }
      });
  } catch (error) {
    debug("Error al buscar usuario By Email ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const findUsuarioById = (req: Request, res: Response): void => {
  try {
    const Idusuario = req.params.Id;
    debug("Parametro de Idusuario recibido :::::>", req.params);
    userAdapater
      .getById(Idusuario)
      ?.then((usuario) => {
        if (usuario) {
          res.status(HttpStatus.OK).json(usuario);
        } else {
          res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        if (error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        }
      });
  } catch (error) {
    debug("Error al buscar Usuario By Id ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const loginUserTallerByUID = (req: Request, res: Response): void => {
  try {
    const uid = req.params.uid;

    userAdapater
      .findOneUserByFilter({ uid })
      ?.then((usuario) => {
        if (usuario) {
          if (usuario.IdTaller) {
            res.status(HttpStatus.OK).json(usuario);
          } else {
            res
              .status(HttpStatus.PRECONDITION_FAILED)
              .json({ error: "Usuario no tiene acceso a ningun taller" });
          }
        } else {
          res
            .status(HttpStatus.PRECONDITION_FAILED)
            .json({ error: "No se encontro el usuario" });
        }
      })
      .catch((error) => {
        if (error) {
          debug(
            "Error al realizar la transaccion de buscar usuario por UID error ::>",
            error.message
          );
          if (error.errors) {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        }
      });
  } catch (error) {
    debug("Error al buscar usuario By UID ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countUsuariosByIdTaller = (req: Request, res: Response): void => {
  try {
    const IdTaller = req.params.Id;
    userAdapater
      .countUsuariosByIdTaller({ IdTaller })
      ?.then((count) => {
        res.status(HttpStatus.OK).json(count);
      })
      .catch((error) => {
        if (error) {
          debug(
            "Error al realizar la transaccion de contar usuarios by idTaller:::>",
            "error ::>",
            error.message
          );
          if (error.errors) {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        }
      });
  } catch (error) {
    debug("Error al contar  usuario ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteUsuarioById = (req: Request, res: Response): void => {
  try {
    const Idusuario = req.params.Id;
    debug("Parametro de Idusuario recibido :::::>", Idusuario);
    userAdapater
      .deleteById(Idusuario)
      ?.then((result) => {
        if (result) {
          res.status(HttpStatus.ACCEPTED).json({
            message: "Se elimino el IdUsuario " + Idusuario + " correctamente",
          });
        } else {
          res.status(HttpStatus.OK).json({ message: "Id no encontrado" });
        }
      })
      .catch((error) => {
        if (error) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        }
      });
  } catch (error) {
    debug("Error al borrar Usuario By Id ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const createFireBaseUsuario = (req: Request, res: Response): void => {
  try {
    const usuario = req.body as UserCreationAttributes;
    debug("Parametro de usuario recibido :::::>", usuario);

    const usuarioDB = {
      email: usuario.email,
      password: usuario.password,
      firstName: usuario.firstName,
      celular:
        usuario.celular && usuario.celular.length === 10
          ? "+57" + usuario.celular
          : usuario.celular,
      identificacion: usuario.identificacion,
      tipoUsuario: usuario.tipoUsuario,
      uid: usuario.uid,
      typeDevice: usuario.typeDevice,
      estado: "Registrado" as const,
    };

    userAdapater
      .createUsuario(usuarioDB)
      ?.then((usuarioResult) => {
        if (usuarioResult) {
          res.status(HttpStatus.OK).json(usuarioResult);
        }
      })
      .catch((error) => {
        if (error) {
          const { errorInfo } = error;
          debug("Error generado al crear el usuario", error);
          if (errorInfo) {
            const { code } = errorInfo;
            switch (code) {
            case "auth/invalid-phone-number":
              res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: "Error en el formato del telefono" });
              break;

            case "auth/email-already-exists":
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Ya existe usuario registrado con ese email",
              });
              break;
            case "auth/phone-number-already-exists":
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Ya exite un usuario registrado con ese celular",
              });
              break;
            default:
              res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: "Error al actualizar el usuario" });
              break;
            }
          } else {
            res
              .status(HttpStatus.METHOD_FAILURE)
              .send({ error: error.message });
          }
        }
      });
  } catch (error) {
    debug("Error al crear usuario ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateUsuarioByUid = (req: Request, res: Response): void => {
  try {
    const uid = req.params.uid;
    const usuario = req.body as UserCreationAttributes;

    debug("Usuario recibido como parametro", usuario);

    let usuarioDB = null;

    if (usuario.celular) {
      usuarioDB = {
        email: usuario.email,
        password: usuario.password,
        firstName: usuario.firstName,
        celular:
          usuario.celular.length !== 10
            ? usuario.celular
            : "+57" + usuario.celular,
        identificacion: usuario.identificacion,
        tipoUsuario: usuario.tipoUsuario,
        uid,
        tokenCM: usuario.tokenCM,
      };
    } else {
      usuarioDB = {
        email: usuario.email,
        password: usuario.password,
        firstName: usuario.firstName,
        identificacion: usuario.identificacion,
        tipoUsuario: usuario.tipoUsuario,
        uid,
        tokenCM: usuario.tokenCM,
      };
    }

    userAdapater
      .updateUsuario(usuarioDB)
      ?.then(() => {
        res.status(HttpStatus.ACCEPTED).json({
          message: "Se actualizo el IdUsuario " + uid + " correctamente",
        });
      })
      .catch((error) => {
        if (error.errorInfo) {
          if (error.errorInfo.code === "auth/invalid-phone-number") {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: "Error en el formato del telefono" });
          } else {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: "Error al actualizar el usuario" });
          }
        }
        /* if (error) {
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
      }
      if (error.error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.error });
      } */
      });
  } catch (error) {
    debug("Error al actualizar usuario ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateUsuarioByIdUsuario = (req: Request, res: Response): void => {
  try {
    const id = req.params.id;
    const usuario = req.body;

    debug("Usuario recibido como parametro", usuario);

    const usuarioDB = {
      firstName: usuario.firstName,
      uid: usuario.uid,
      typeDevice: usuario.typeDevice,
      email: usuario.email,
    };

    userAdapater
      .updateUsuarioByIdUsuario(id, usuarioDB)
      ?.then((usuarioRes) => {
        if (usuarioRes) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se actualizo el IdUsuario " + id + " correctamente",
          });
        }
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          if (error.errors) {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
          }
        }
      });
  } catch (error) {
    debug("Error al actualizar usuario ", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  findUsuarioById,
  getAllUsuarios,
  findUserByEmail,
  loginUserTallerByUID,
  countUsuariosByIdTaller,
  deleteUsuarioById,
  createFireBaseUsuario,
  updateUsuarioByUid,
  updateUsuarioByIdUsuario,
};
