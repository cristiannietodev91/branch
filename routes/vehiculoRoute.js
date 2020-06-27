var express = require("express");
var vehiculoController = require("../controller/vehiculoController");
var router = express.Router();

/* GET users listing. */
router.get("/getAll", vehiculoController.getAllVehiculos);

router.get("/getById/:Id", vehiculoController.findVehiculoById);

router.get("/getByIdTaller/:Id", vehiculoController.getAllVehiculosByIdTaller);

router.get("/countByIdTaller/:Id", vehiculoController.countVehiculosByIdTaller);

router.get(
  "/getPaginateByIdTaller/:Id",
  vehiculoController.getAllPaginateFilterVehiculosByIdTaller
);

router.get(
  "/getByIdUsuario/:Id",
  vehiculoController.getAllVehiculosByIdUsuario
);

router.get("/getByPlaca/:placa", vehiculoController.getVehiculoByPlaca);

router.post("/create", vehiculoController.createVehiculo);

router.put("/update/:Id", vehiculoController.updateVehiculo);

router.put(
  "/updateFechavencimiento/:Id",
  vehiculoController.updateFechaVencimiento
);

router.delete("/deleteById/:Id", vehiculoController.deleteVehiculoById);

module.exports = router;
