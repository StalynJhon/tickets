const express = require('express');
const router = express.Router();

const promotionsCtl = require('../../http/controllers/promotions.controller');

// ================= PROMOCIONES =================

// Obtener todas las promociones
router.get('/', promotionsCtl.mostrarPromociones);

// Obtener promociones vigentes
router.get('/vigentes', promotionsCtl.obtenerPromocionesVigentes);

// Crear promoción
router.post('/', promotionsCtl.crearPromocion);

// Actualizar promoción
router.put('/:id', promotionsCtl.actualizarPromocion);

// Eliminar (desactivar) promoción
router.delete('/:id', promotionsCtl.eliminarPromocion);

module.exports = router;
