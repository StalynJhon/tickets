const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const CryptoJS = require("crypto-js"); // IMPORTANTE: Debes tener instalado crypto-js

const app = express();
const SECRET_KEY = "mi_clave_secreta_123"; // Tu llave para encriptar

app.use(cors());
app.use(express.json());

// --- FUNCIONES DE PROTECCIÓN ---
const encriptar = (texto) => {
  if (!texto) return "";
  return CryptoJS.AES.encrypt(texto, SECRET_KEY).toString();
};

const desencriptar = (textoEncriptado) => {
  try {
    if (!textoEncriptado) return "";
    const bytes = CryptoJS.AES.decrypt(textoEncriptado, SECRET_KEY);
    const original = bytes.toString(CryptoJS.enc.Utf8);
    return original ? original : textoEncriptado; // Si no puede desencriptar, devuelve el original
  } catch (e) {
    return textoEncriptado; 
  }
};

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'tickets' 
});

console.log("Intentando conectar a MySQL...");

db.connect((err) => {
  if (err) {
    console.error('❌ ERROR CRÍTICO DE MYSQL:', err.message);
  } else {
    console.log('✅ CONECTADO EXITOSAMENTE A MYSQL');
  }
});

// --- RUTAS MODIFICADAS PARA ENCRIPTAR ---

app.get('/api/categorias', (req, res) => {
  const sql = 'SELECT idEvent as id, nameEvent as nombre, descriptionEvent as descripcion, estado FROM categories';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    
    // Desencriptamos para que Angular vea el texto real
    const datosDesencriptados = results.map(cat => ({
      ...cat,
      nombre: desencriptar(cat.nombre),
      descripcion: desencriptar(cat.descripcion)
    }));
    res.json(datosDesencriptados);
  });
});

app.post('/api/categorias', (req, res) => {
  const { nombre, descripcion } = req.body;
  const sql = 'INSERT INTO categories (nameEvent, descriptionEvent, estado) VALUES (?, ?, 1)';
  
  // Guardamos los datos encriptados en la base de datos
  db.query(sql, [encriptar(nombre), encriptar(descripcion)], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Guardado con éxito', id: result.insertId });
  });
});

app.put('/api/categorias/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion } = req.body;
  const sql = 'UPDATE categories SET nameEvent = ?, descriptionEvent = ? WHERE idEvent = ?';
  
  // Encriptamos también al actualizar
  db.query(sql, [encriptar(nombre), encriptar(descripcion), id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Actualizado' });
  });
});

app.patch('/api/categorias/:id/toggle', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE categories SET estado = NOT estado WHERE idEvent = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Estado cambiado' });
  });
});

app.delete('/api/categorias/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categories WHERE idEvent = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Categoría eliminada' });
  });
});

app.listen(3000, () => {
  console.log("🚀 Servidor Backend corriendo en http://localhost:3000");
});