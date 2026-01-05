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
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('❌ ERROR LISTAR CLIENTES:', error);
    res.status(500).json({ message: 'Error al listar clientes' });
  }
};

/**
 * OBTENER CLIENTE POR ID
 */
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, nombre, email, telefono, documento
       FROM clientes_frontend
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ ERROR GET CLIENTE:', error);
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
};

/**
 * CREAR CLIENTE
 */
const crearCliente = async (req, res) => {
  try {
    console.log('📥 BODY FRONTEND:', req.body);

    const { nombre, email, telefono, documento } = req.body;

    if (!nombre || !email || !telefono || !documento) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

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
    console.error('❌ ERROR CREAR CLIENTE:', error);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

/**
 * ACTUALIZAR CLIENTE
 */
const actualizarCliente = async (req, res) => {
  try {
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
    console.error('❌ ERROR ACTUALIZAR CLIENTE:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

module.exports = {
  listarClientes,
  getClienteById,
  crearCliente,
  actualizarCliente
};
