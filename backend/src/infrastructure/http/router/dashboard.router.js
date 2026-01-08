// backend/src/infrastructure/http/router/dashboard.router.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Importa tus variables de conexión desde keys.js
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('../../../config/keys');

// =======================
// Crear pool de MySQL
// =======================
const pool = mysql.createPool({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE,
  port: parseInt(MYSQLPORT, 10),
  connectionLimit: 10
});

// =======================
// Estadísticas generales
// =======================
router.get('/estadisticas', async (req, res) => {
  try {
    // Total clientes
    const [totalClientes] = await pool.query('SELECT COUNT(*) AS total FROM clientes');

    // Total eventos activos (ajustado al nombre de columna real)
    const [eventosActivos] = await pool.query("SELECT COUNT(*) AS total FROM events WHERE statusEvent='published'");

    // Eventos de hoy
    const [eventosHoy] = await pool.query("SELECT COUNT(*) AS total FROM events WHERE DATE(dateTimeEvent)=CURDATE()");

    // Eventos esta semana
    const [eventosSemana] = await pool.query(
      "SELECT COUNT(*) AS total FROM events WHERE DATE(dateTimeEvent) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)"
    );

    // Productos activos (ajustado al nombre de tabla y columna)
    const [productosActivos] = await pool.query("SELECT COUNT(*) AS total FROM products WHERE stateProduct=1");

    res.json({
      totalClientes: totalClientes[0].total,
      eventosActivos: eventosActivos[0].total,
      eventosHoy: eventosHoy[0].total,
      eventosSemana: eventosSemana[0].total,
      productosActivos: productosActivos[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// =======================
// Próximos eventos
// =======================
router.get('/eventos/proximos', async (req, res) => {
  try {
    const [eventos] = await pool.query(
      "SELECT idEvent AS id, nameEvent AS nombre, dateTimeEvent AS fecha FROM events WHERE DATE(dateTimeEvent) >= CURDATE() ORDER BY dateTimeEvent ASC LIMIT 10"
    );
    res.json(eventos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo próximos eventos' });
  }
});

// =======================
// Clientes recientes
// =======================
router.get('/clientes/recientes', async (req, res) => {
  try {
    const [clientes] = await pool.query(
      `SELECT 
          idClientes AS id, 
          nombreCliente AS nombre, 
          usernameCliente AS email, 
          createCliente AS fecha_creacion 
       FROM clientes 
       ORDER BY createCliente DESC 
       LIMIT 10`
    );
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo clientes recientes' });
  }
});

// =======================
// Eventos más vendidos (opcional)
// =======================
router.get('/eventos/top-ventas', async (req, res) => {
  try {
    const [eventos] = await pool.query(
      `SELECT e.idEvent AS id, e.nameEvent AS nombre, SUM(t.cantidad) AS totalVentas
       FROM events e
       JOIN transactions t ON t.evento_id = e.idEvent
       GROUP BY e.idEvent, e.nameEvent
       ORDER BY totalVentas DESC
       LIMIT 5`
    );
    res.json(eventos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo eventos top ventas' });
  }
});

module.exports = router;
