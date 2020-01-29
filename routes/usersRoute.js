var express = require('express');
var userController = require('../controller/userController')
var router = express.Router();

/* GET users listing. */
router.get('/getAll', userController.getAllUsuarios);

router.get('/getById/:Id', userController.findUsuarioById);

router.post('/create', userController.createUsuario);

//router.get('/config', userController.helloWorld);

router.post('/createFireBaseUser', userController.createFireBaseUsuario);

router.put('/update/:Id', userController.updateUsuario);

router.delete('/deleteById/:Id', userController.deleteUsuarioById);


module.exports = router;
