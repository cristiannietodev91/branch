var express = require('express');
var vehiculoController = require('../controller/vehiculoController')
var router = express.Router();

/* GET users listing. */
router.get('/getAll', vehiculoController.getAllVehiculos);

router.get('/getById/:Id', vehiculoController.findVehiculoById);

router.post('/create', vehiculoController.createVehiculo);

router.put('/update/:Id', vehiculoController.updateVehiculo);

router.delete('/deleteById/:Id', vehiculoController.deleteVehiculoById);


module.exports = router;
