var express = require("express");
var notificacionController = require("../controller/notificacionController");
var router = express.Router();

/* GET notificaciones. */
router.get(
  "/getByIdUsuario/:IdUsuario",
  notificacionController.getNotificacionesByIdusuario
);

module.exports = router;
