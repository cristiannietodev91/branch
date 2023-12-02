import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import admin from "../utils/firebase";

async function validSession(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionCookie = req.cookies.session || "";

    if(!sessionCookie || sessionCookie === "") {
      const authHeader = req.headers.authorization || "";
      const sessionToken = authHeader && authHeader.split(" ")[1];

      if (!sessionToken || sessionToken === "") {
        return res.status(HttpStatus.UNAUTHORIZED).send({ error: "User does not have access to this resource. Log In with a valid user." });
      }

      const decodedClaims = await admin.auth().verifyIdToken(sessionToken);
    
      if (decodedClaims) {
        return next();
      }

      return res.status(HttpStatus.UNAUTHORIZED).send({ error: "User does not have access. Log In with a valid user." });
    }

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

    if (decodedClaims) {
      return next();
    }

    return res.status(HttpStatus.UNAUTHORIZED).send({ error: "No authorized to access to this resource" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: error.message });
    }
    throw error;
  }
}

export default {
  validSession,
};
