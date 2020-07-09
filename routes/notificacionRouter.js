var express = require("express");
var notificacionController = require("../controller/notificacionController");
var router = express.Router();

/* GET notificaciones. */
router.get(
  "/getByIdUsuario/:IdUsuario",
  notificacionController.getNotificacionesByIdusuario
);

router.get(
  "/countByIdUsuario/:IdUsuario",
  notificacionController.countNotificacionesByIdusuario
);

router.put(
  "/updateReadNotificaciones",
  notificacionController.updateNotificacionesByIdusuario
);

module.exports = router;
