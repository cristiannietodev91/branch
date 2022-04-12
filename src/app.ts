import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
// import * as helmet from "helmet";

import * as indexRouter from "./routes/index";
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

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(helmet());

//Secure
app.disable("x-powered-by");

indexRouter.register(app);
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

const logErrors = (
  err: { stack: any },
  req: any,
  res: any,
  next: (arg0: any) => void
) => {
  next(err);
};

const errorHandler = (
  err: { status: any; message: any },
  req: any,
  res: {
    status: (arg0: any) => void;
    json: (arg0: { message: any; error: any }) => void;
  },
  next: any
) => {
  res.status(err.status || 500);
  res.json({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    message: err.message,
    error: err,
  });
};

app.use(logErrors);
// app.use(clientErrorHandler);
app.use(errorHandler);

module.exports = app;
