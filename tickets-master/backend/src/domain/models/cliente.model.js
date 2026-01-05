class Cliente {
  constructor({ nombre, email, telefono, documento, estado = 'ACTIVO', activo = 1 }) {
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.documento = documento;
    this.estado = estado;
    this.activo = activo;
  }
}

module.exports = Cliente;
