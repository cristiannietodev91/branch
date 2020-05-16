const express = require("express");
const mecancioController = require("../controller/mecanicoController");
const router = express.Router();

/* GET users listing. */
router.get("/getAll", mecancioController.getAllMecanicos);

router.get("/getById/:Id", mecancioController.findMecanicoById);

router.post("/create", mecancioController.createMecanico);

module.exports = router;
