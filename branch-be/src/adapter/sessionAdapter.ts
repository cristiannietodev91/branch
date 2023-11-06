import usersDAO from "../dao/usersDAO";
import admin from "../utils/firebase";

const createSession = async (idToken: string, uid: string, expiresIn = 1000) => {
  if(!idToken) {
    throw new Error("The IdToken is required to start the session");
  }

  if(!uid) {
    throw new Error("The user uid is required to start the session");
  }
  const [sessionCookie, user] = await Promise.all([
    admin.auth().createSessionCookie(idToken, {expiresIn: expiresIn}),
    usersDAO.findOneByFilter({ uid })
  ]);
  
  return {
    session: sessionCookie,
    user,
  };
};

export default {
  createSession,
};