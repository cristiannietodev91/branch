var express = require("express");
var ordenController = require("../controller/ordenController");
var router = express.Router();

/* GET users listing. */
router.get("/getById/:Id", ordenController.getOrdenById);

router.get("/getAllEtapas", ordenController.getAllEtapas);

router.post("/create", ordenController.createOrden);

router.get("/getByIdTaller/:Id", ordenController.getAllOrdenesByIdTaller);

router.put("/update/:Id", ordenController.updateOrden);

router.get(
  "/getByIdTallerAndFilter/:Id",
  ordenController.getAllOrdenesByIdTallerAndFilter
);

module.exports = router;
