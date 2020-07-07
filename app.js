var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRoute");
const tallerRouter = require("./routes/tallerRoute");
const vehiculoRouter = require("./routes/vehiculoRoute");
const marcaRouter = require("./routes/marcaRoute");
const citaRouter = require("./routes/citaRoute");
const mecanicoRouter = require("./routes/mecanicoRoute");
const ordenRouter = require("./routes/ordenRoute");
const fileRouter = require("./routes/fileRoute");
const messageRouter = require("./routes/messageRoute");
const servicioRouter = require("./routes/serviciosRoute");
const conversacionRouter = require("./routes/conversacionRoute");
const notificacionRouter = require("./routes/notificacionRouter");

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/usuario", usersRouter);
app.use("/taller", tallerRouter);
app.use("/vehiculo", vehiculoRouter);
app.use("/marca", marcaRouter);
app.use("/cita", citaRouter);
app.use("/mecanico", mecanicoRouter);
app.use("/orden", ordenRouter);
app.use("/file", fileRouter);
app.use("/message", messageRouter);
app.use("/servicios", servicioRouter);
app.use("/conversacion", conversacionRouter);
app.use("/notificacion", notificacionRouter);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

module.exports = app;

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
}
