var express = require('express');
var tallerController = require('../controller/tallerController')
var router = express.Router();

/* GET users listing. */
router.get('/getAll', tallerController.getAllTalleres);

router.get('/getById/:Id', tallerController.findTallerById);

router.post('/create', tallerController.createTaller);

router.put('/update/:Id', tallerController.updateTaller);

router.delete('/deleteById/:Id', tallerController.deleteTallerById);


module.exports = router;
