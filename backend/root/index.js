const app = require('./app');

// Obtener puerto desde app
const port = app.get('port');

// Iniciar servidor
const server = app.listen(port, () => {
    console.log(`✅ El servidor está escuchando en el puerto ${port}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// ==================== MANEJO DE ERRORES ====================

// Error al iniciar el servidor (puerto ocupado, etc.)
server.on('error', (error) => {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
});

// Errores no capturados (async / promesas)
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});

// Errores no controlados
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no controlada:', error);
    process.exit(1);
});
