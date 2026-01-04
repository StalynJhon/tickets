const express = require("express");
const router = express.Router();

const {mostrarMensaje} = require('../../http/controllers/index.controller')

// Importar rutas adicionales
const configuracionRouter = require('./configuracion.router');

router.get('/', mostrarMensaje)

// Usar rutas adicionales
router.use('/configuracion', configuracionRouter);

module.exports = router
