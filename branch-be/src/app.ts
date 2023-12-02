import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import csrf from "./utils/csrf";
// import * as helmet from "helmet";

import * as indexRouter from "./routes/index";
import * as sessionRouter from "./routes/sessionRoute";
import * as usersRouter from "./routes/usersRoute";
import * as tallerRouter from "./routes/tallerRoute";
import * as vehiculoRouter from "./routes/vehiculoRoute";
import * as marcaRouter from "./routes/marcaRoute";
import * as citaRouter from "./routes/citaRoute";
import * as mecanicoRouter from "./routes/mecanicoRoute";
import * as ordenRouter from "./routes/ordenRoute";
import * as fileRouter from "./routes/fileRoute";
import * as messageRouter from "./routes/messageRoute";
import * as servicioRouter from "./routes/serviciosRoute";
import * as conversacionRouter from "./routes/conversacionRoute";
import * as notificacionRouter from "./routes/notificacionRouter";

import sessionMiddleware from  "./middleware/session";

const app = express();

app.use(cors({ origin: true , credentials: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SESSION_KEY_SECRET || "nonSecure key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30, // 30 min
    secure: false,
  }
}));

//Secure
app.disable("x-powered-by");

indexRouter.register(app);

app.use(csrf.csrfSynchronisedProtection);

sessionRouter.register(app);

app.use(sessionMiddleware.validSession);

usersRouter.register(app);
tallerRouter.register(app);
vehiculoRouter.register(app);
marcaRouter.register(app);
citaRouter.register(app);
mecanicoRouter.register(app);
ordenRouter.register(app);
fileRouter.register(app);
messageRouter.register(app);
servicioRouter.register(app);
conversacionRouter.register(app);
notificacionRouter.register(app);

const errorHandler: ErrorRequestHandler = (
  err,
  _,
  res,
  next
) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      type: err.type, 
      error: err.error.toString(),
    });
  } else {
    res.status(err.status || 500);
    res.json({
      error: err.message,
    });
  }
  next();
};

app.use(errorHandler);

export default app;
