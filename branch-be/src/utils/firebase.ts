import admin from "firebase-admin";

admin.initializeApp(
  {
    credential: process.env.FIREBASE_ACCOUNT_KEY ? 
      admin.credential.cert(JSON.parse(process.env.FIREBASE_ACCOUNT_KEY || "")) :
      admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_NAME,
  }
);

export default admin;