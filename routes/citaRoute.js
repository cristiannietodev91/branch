var express = require("express");
var citaController = require("../controller/citaController");
var router = express.Router();

/* GET users listing. */
router.get("/getAll", citaController.getAllCitas);

router.get("/getById/:Id", citaController.findCitaById);

router.get("/getByIdTaller/:Id", citaController.getAllCitasByIdTaller);

router.get("/countByIdTaller/:Id", citaController.countCitasByIdTaller);

router.get("/countByEstado/:Id", citaController.countCitasByEstadoIdTaller);

router.get("/countByDate/:Id", citaController.countCitasByDateAndIdTaller);

router.get("/getByIdUsuario/:Id", citaController.getAllCitasByIdUsuario);

router.get(
  "/getPasadasByIdUsuario/:Id",
  citaController.getAllCitasPasadasByIdUsuario
);

router.get(
  "/getActivasByIdUsuario/:Id",
  citaController.getAllCitasActivasByIdUsuario
);

router.get(
  "/getFuturasByIdUsuario/:Id",
  citaController.getAllCitasFuturasByIdUsuario
);

router.post("/create", citaController.createCita);

router.put("/update/:Id", citaController.updateCita);

router.put("/calificar/:Id", citaController.calificaCita);

router.delete("/deleteById/:Id", citaController.deleteCitaById);

router.get("/getByIdTallerAndFilter/:Id", citaController.getAllCitasByfilter);

module.exports = router;
