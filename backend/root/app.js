// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const fileUpload = require("express-fileupload");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const winston = require('winston');
const fs = require('fs');
const crypto = require('crypto');
const hpp = require('hpp');
const toobusy = require('toobusy-js');
const cors = require('cors');

// Config
const {
  MYSQLHOST,
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLDATABASE,
  MYSQLPORT
} = require('../src/config/keys');

// 🔴 CAMBIO CLAVE
if (process.env.ENABLE_PASSPORT === 'true') {
  require('../src/lib/passport');
}

// Crear aplicación
const app = express();
app.set('port', process.env.PORT || 5000);

// CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad
app.use(helmet());
app.use(hpp());

// Cookies
app.use(cookieParser(
  process.env.COOKIE_SECRET || crypto.randomBytes(64).toString('hex')
));

// Sesión (NO se elimina)
const sessionConfig = {
  store: new MySQLStore({
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE
  }),
  secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
};

app.use(session(sessionConfig));
app.use(flash());

// Passport (CONDICIONAL)
if (process.env.ENABLE_PASSPORT === 'true') {
  app.use(passport.initialize());
  app.use(passport.session());
}

// =========================
// RUTAS
// =========================
app.use(require('../src/infrastructure/http/router/index'));
app.use('/pagina', require('../src/infrastructure/http/router/pagina.router'));
app.use('/auth', require('../src/infrastructure/http/router/auth.router'));
app.use('/rol', require('../src/infrastructure/http/router/rol.router'));
app.use('/detalleRol', require('../src/infrastructure/http/router/detalleRol.router'));

// ✅ CAMBIO CRÍTICO (ANTES: /cliente)
app.use('/clientes', require('../src/infrastructure/http/router/cliente.router'));

// =========================
// MANEJO DE ERRORES
// =========================
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
