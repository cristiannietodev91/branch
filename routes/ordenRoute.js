var express = require('express');
var ordenController = require('../controller/ordenController')
var router = express.Router();

/* GET users listing. */
router.get('/getAllEtapas', ordenController.getAllEtapas);

router.post('/create', ordenController.createOrden);

router.get('/getByIdTaller/:Id', ordenController.getAllOrdenesByIdTaller);

module.exports = router;
