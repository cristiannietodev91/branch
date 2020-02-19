var express = require('express');
var citaController = require('../controller/citaController')
var router = express.Router();

/* GET users listing. */
router.get('/getAll', citaController.getAllCitas);

router.get('/getById/:Id', citaController.findCitaById);

router.get('/getByIdTaller/:Id', citaController.getAllCitasByIdTaller);

router.get('/getByIdUsuario/:Id', citaController.getAllCitasByIdUsuario);

router.post('/create', citaController.createCita);

router.put('/update/:Id', citaController.updateCita);

router.delete('/deleteById/:Id', citaController.deleteCitaById);


module.exports = router;
