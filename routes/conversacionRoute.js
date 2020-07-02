const express = require("express");
const conversacionController = require("../controller/conversacionController");
const router = express.Router();

/* GET users listing. */
router.get(
  "/getAllByIdTaller/:Id",
  conversacionController.getConversacionesByIdTaller
);

module.exports = router;
