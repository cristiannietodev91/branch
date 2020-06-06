var express = require("express");
var userController = require("../controller/userController");
var router = express.Router();

/* GET users listing. */
router.get("/getAll", userController.getAllUsuarios);

router.get("/getById/:Id", userController.findUsuarioById);

router.get("/loginUsuario/:uid", userController.loginUserTallerByUID);

router.get("/getByEmail/:email", userController.findUserByEmail);

router.post("/createFireBaseUser", userController.createFireBaseUsuario);

router.put("/update/:uid", userController.updateUsuarioByUid);

router.put("/updateByIdUsuario/:id", userController.updateUsuarioByIdUsuario);

router.delete("/deleteById/:Id", userController.deleteUsuarioById);

module.exports = router;
