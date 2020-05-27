var express = require("express");
var servicioController = require("../controller/serviciosController");
var router = express.Router();

/* GET users listing. */
router.get("/getAll", servicioController.getListaServicios);

router.post("/create", servicioController.crearServicio);

router.get(
  "/getByVehiculo/:Id",
  servicioController.getListaServiciosByVehiculo
);

module.exports = router;
