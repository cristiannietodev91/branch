import HttpStatus from "http-status-codes";
import userAdapter from "../adapter/userAdapter";
import { Request, Response } from "express";
import Debug from "debug";
import { UserCreationAttributes, UserCreationRequest } from "../types";
import { ValidationError } from "sequelize";
const debug = Debug("branch:server");

const getAllUsers = (req: Request, res: Response): void => {
  userAdapter
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

const findUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;

    const user = await userAdapter
      .findOneUserByFilter({ email });

    if(user) {
      return res.status(HttpStatus.OK).json(user);
    }
    
    return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
    
  } catch (error) {
    debug("Error searching user By Email ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const findUserById = async (req: Request, res: Response) => {
  try {
    const Idusuario = req.params.Id;
    debug("Parametro de Idusuario recibido :::::>", req.params);
    const user = await userAdapter.getById(Idusuario);

    if(user) {
      return res.status(HttpStatus.OK).json(user);
    }

    return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });

  } catch (error) {
    debug("Error al buscar Usuario By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getUserByUID = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;

    const user = await userAdapter.findOneUserByFilter({ uid });

    if(user) {
      if (user.IdTaller) {
        return res.status(HttpStatus.OK).json(user);
      } else {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: "User does not have access to the workshop" });
      }
    }

    return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
  } catch (error) {
    debug("Error al buscar usuario By UID ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countUsersByIdWorkshop = async (req: Request, res: Response) => {
  try {
    const IdWorkshop = req.params.IdWorkshop;

    const count = await userAdapter.countUsersByIdWorkshop({ IdTaller: IdWorkshop });

    return res.status(HttpStatus.OK).json(count);
      
  } catch (error) {
    debug("Error counting user", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const IdUser = parseInt(req.params.Id, 10);
    debug(`UserId param received ${IdUser}`);

    if (isNaN(IdUser)) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "Param IdUser must be a number."});
    }

    const result = await userAdapter.deleteById(IdUser);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: `The userId [${IdUser}] was deleted.`,
      });
    } else {
      return res.status(HttpStatus.OK).json({ message: "User id not found" });
    }
  } catch (error) {
    debug("Error deleting user by id", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const createFireBaseUser = async (req: Request, res: Response) => {
  try {
    const usuario = req.body as UserCreationRequest;
    debug(`User to create :::::> ${JSON.stringify(usuario)}`, );

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
      estado: "Registrado" as const,
    };

    const userResult = await userAdapter.createUser(usuarioDB);

    if(userResult) {
      return res.status(HttpStatus.OK).json(userResult);
    }

    return res.status(HttpStatus.BAD_REQUEST).json({ error: "Error creating user."});
  } catch (error: any) {
    const { code } = error;
    
    switch (code) {
    case "auth/invalid-phone-number":
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Error phone number is not a valid." });

    case "auth/email-already-exists":
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "User already registered with that email.",
      });
    case "auth/phone-number-already-exists":
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "User already registered with that phone number.",
      });
    default:
      return res
        .status(HttpStatus.BAD_REQUEST)
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

    userAdapter
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

    userAdapter
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
  findUserById,
  getAllUsers,
  findUserByEmail,
  getUserByUID,
  countUsersByIdWorkshop,
  deleteUserById,
  createFireBaseUser,
  updateUsuarioByUid,
  updateUsuarioByIdUsuario,
};
