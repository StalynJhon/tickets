const express = require('express');
const router = express.Router();
const {
  getConfiguracionGeneral,
  guardarConfiguracionGeneral,
  getTextosLegales,
  guardarTextosLegales,
  getConfiguracionNegocio,
  guardarConfiguracionNegocio,
  getInfoEmpresa,
  getTerminosCondiciones,
  getPoliticaPrivacidad,
  getAyudaFAQ
} = require('../controllers/configuracion.controller');

// Importar middleware de autenticación
const authMiddleware = require('../../../application/auth');

// Rutas para administrador
router.get('/general', getConfiguracionGeneral);
router.post('/general', guardarConfiguracionGeneral);
router.get('/legal', getTextosLegales);
router.post('/legal', guardarTextosLegales);
router.get('/negocio', getConfiguracionNegocio);
router.post('/negocio', guardarConfiguracionNegocio);

// Rutas para clientes
router.get('/empresa', getInfoEmpresa);
router.get('/terminos', getTerminosCondiciones);
router.get('/privacidad', getPoliticaPrivacidad);
router.get('/ayuda', getAyudaFAQ);

module.exports = router;