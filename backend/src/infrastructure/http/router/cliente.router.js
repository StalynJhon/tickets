const express = require('express');
const router = express.Router();

const {
  listarClientes,
  getClienteById,
  crearCliente,
  actualizarCliente
} = require('../controllers/cliente.controller');

router.get('/', listarClientes);
router.get('/:id', getClienteById);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);

module.exports = router;
