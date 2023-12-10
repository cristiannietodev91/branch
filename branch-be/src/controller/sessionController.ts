import HttpStatus from "http-status-codes";
import sessionAdapter from "../adapter/sessionAdapter";
import { Request, Response } from "express";
import { UserCreationRequest } from "../types";
import Debug from "debug";
import userAdapter from "../adapter/userAdapter";

const debug = Debug("branch:server");

const logIn = async (req: Request, res: Response) => {

  try {
    const { idToken, uid } = req.body || {};

    if (!idToken || !uid) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "The idToken and ui params are required to logIn." });
    }

    const expiresIn = 60 * 15 * 1000; // 15 minutes firebase session
    const { session, user } = await sessionAdapter.createSession(idToken, uid, expiresIn);
    const options = { maxAge: expiresIn, httpOnly: true, secure: false };

    res.cookie("session", session, options);
    res.status(HttpStatus.OK).send({ user });

  } catch (error) {
    if(error instanceof Error) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: error.message });
    }
    throw error;
  }

};

const logOut = (_: Request, res: Response) => {
  res.clearCookie("session");
  res.status(HttpStatus.OK).send({ status: "Session cleared" });
};

const registerUserFirebase = async (req: Request, res: Response) => {
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

export default {
  logIn,
  logOut,
  registerUserFirebase,
};