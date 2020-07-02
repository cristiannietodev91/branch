const express = require("express");
const mecanicoController = require("../controller/mecanicoController");
const router = express.Router();

/* GET users listing. */
router.get("/getAll", mecanicoController.getAllMecanicos);

router.get(
  "/getAllByIdTaller/:Id",
  mecanicoController.getAllMecanicosByIdtaller
);

router.get("/getById/:Id", mecanicoController.findMecanicoById);

router.post("/create", mecanicoController.createMecanico);

router.put("/update/:Id", mecanicoController.updateMecanico);

router.delete("/deleteById/:Id", mecanicoController.deleteCitaById);

module.exports = router;
