var express = require('express');
var marcaController = require('../controller/marcaController')
var router = express.Router();

/* GET users listing. */
router.get('/getAll', marcaController.getAllMarcas);

router.get('/getAllUnique', marcaController.getListUniqueMarcas);

router.get('/getById/:Id', marcaController.findMarcaById);

router.post('/create', marcaController.createMarca);

router.put('/update/:Id', marcaController.updateMarca);

router.delete('/deleteById/:Id', marcaController.deleteMarcaById);


module.exports = router;
