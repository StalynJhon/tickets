const pool = require('../../database/connection/mysql.connection');

/**
 * LISTAR CLIENTES
 */
const listarClientes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre,
        email,
        telefono,
        documento,
        estado,
        activo
      FROM clientes_frontend
      WHERE activo = 1
    `);

    res.json(rows);
  } catch (error) {
    console.error('❌ ERROR LISTAR:', error);
    res.status(500).json({ message: 'Error al listar clientes' });
  }
};

/**
 * OBTENER CLIENTE POR ID (EDITAR)
 */
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        id,
        nombre,
        email,
        telefono,
        documento
       FROM clientes_frontend
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ ERROR GET BY ID:', error);
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
};

/**
 * CREAR CLIENTE
 */
const crearCliente = async (req, res) => {
  try {
    console.log('📥 CLIENTE API (CREATE):', req.body);

    const { nombre, email, telefono, documento } = req.body;

    const sql = `
      INSERT INTO clientes_frontend
      (nombre, email, telefono, documento, estado, activo)
      VALUES (?, ?, ?, ?, 'ACTIVO', 1)
    `;

    const [result] = await pool.query(sql, [
      nombre,
      email,
      telefono,
      documento
    ]);

    res.status(201).json({
      message: 'Cliente creado correctamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ ERROR CREAR:', error);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

/**
 * ACTUALIZAR CLIENTE (EDITAR)
 */
const actualizarCliente = async (req, res) => {
  try {
    console.log('✏️ CLIENTE API (UPDATE):', req.body);

    const { id } = req.params;
    const { nombre, email, telefono, documento } = req.body;

    const sql = `
      UPDATE clientes_frontend
      SET nombre = ?, email = ?, telefono = ?, documento = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      nombre,
      email,
      telefono,
      documento,
      id
    ]);

    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ACTUALIZAR:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

module.exports = {
  listarClientes,
  getClienteById,
  crearCliente,
  actualizarCliente
};
