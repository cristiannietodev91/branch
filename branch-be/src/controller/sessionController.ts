import HttpStatus from "http-status-codes";
import sessionAdapter from "../adapter/sessionAdapter";
import { Request, Response } from "express";

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

export default {
  logIn,
  logOut,
};