const express = require('express');
const router = express.Router();

const {
  listarClientes,
  getClienteById,
  crearCliente,
  actualizarCliente
} = require('../controllers/cliente.controller');

// LISTAR
router.get('/', listarClientes);

// OBTENER POR ID (EDITAR)
router.get('/:id', getClienteById);

// CREAR
router.post('/', crearCliente);

// ACTUALIZAR (EDITAR)
router.put('/:id', actualizarCliente);

module.exports = router;
