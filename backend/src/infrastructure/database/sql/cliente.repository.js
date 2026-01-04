const sql = `
  INSERT INTO clientes (
    cedulaCliente,
    nombreCliente,
    usernameCliente,
    telefonoCliente,
    estado,
    activo
  )
  VALUES (?, ?, ?, ?, ?, ?)
`;

await pool.query(sql, [
  cliente.documento,
  cliente.nombre,
  cliente.email,
  cliente.telefono,
  cliente.estado,
  cliente.activo
]);
