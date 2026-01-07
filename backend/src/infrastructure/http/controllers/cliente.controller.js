const clienteCtl = {};
const orm = require('../../../infrastructure/database/connection/dataBase.orm');
const sql = require('../../../infrastructure/database/connection/dataBase.sql');
const mongo = require('../../../infrastructure/database/connection/dataBaseMongose');
const { cifrarDatos, descifrarDatos } = require('../../../application/services/encrypDates');

const descifrarSeguro = (dato) => {
  try { return dato ? descifrarDatos(dato) : ''; } 
  catch (e) { console.error('Error al descifrar:', e); return ''; }
};

// Mostrar clientes
clienteCtl.mostrarClientes = async (req, res) => {
  try {
    const [listaClientes] = await sql.promise().query('SELECT * FROM clientes WHERE stadoCliente="activo"');

    const clientes = await Promise.all(listaClientes.map(async c => {
      const m = await mongo.clienteModel.findOne({ idClienteSql: c.idClientes });
      return {
        idClientes: c.idClientes,
        cedulaCliente: descifrarSeguro(c.cedulaCliente),
        nombreCliente: descifrarSeguro(c.nombreCliente),
        usernameCliente: descifrarSeguro(c.usernameCliente),
        correoCliente: m ? descifrarSeguro(m.emailCliente) || '' : '',
        telefonoCliente: m ? descifrarSeguro(m.telefonoCliente) || '' : '',
        direccionCliente: m ? descifrarSeguro(m.direccionCliente) || '' : '',
        tipoCliente: m ? m.tipoCliente : 'Regular',
        stadoCliente: c.stadoCliente
      };
    }));

    res.json(clientes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al mostrar clientes', error: e.message });
  }
};

// Crear cliente
clienteCtl.crearCliente = async (req, res) => {
  try {
    const { cedulaCliente, nombreCliente, usernameCliente, passwordCliente, direccionCliente, telefonoCliente, emailCliente, tipoCliente } = req.body;
    if (!cedulaCliente || !nombreCliente || !usernameCliente || !passwordCliente)
      return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const nuevo = await orm.cliente.create({
      cedulaCliente: cifrarDatos(cedulaCliente),
      nombreCliente: cifrarDatos(nombreCliente),
      usernameCliente: cifrarDatos(usernameCliente),
      passwordCliente: cifrarDatos(passwordCliente),
      stadoCliente: 'activo',
      createCliente: new Date().toLocaleString()
    });

    // Crear o reemplazar en Mongo
    const mongoCliente = await mongo.clienteModel.findOneAndUpdate(
      { idClienteSql: nuevo.idClientes },
      { $set: {
          emailCliente: cifrarDatos(emailCliente || ''),
          telefonoCliente: cifrarDatos(telefonoCliente || ''),
          direccionCliente: cifrarDatos(direccionCliente || ''),
          tipoCliente: tipoCliente || 'Regular'
        }},
      { upsert: true, new: true }
    );

    // Devolver al front **solo los datos correctos**
    res.status(201).json({
      idClientes: nuevo.idClientes,
      cedulaCliente,
      nombreCliente,
      usernameCliente,
      correoCliente: descifrarSeguro(mongoCliente.emailCliente) || '',
      telefonoCliente: descifrarSeguro(mongoCliente.telefonoCliente) || '',
      direccionCliente: descifrarSeguro(mongoCliente.direccionCliente) || '',
      tipoCliente: mongoCliente.tipoCliente,
      stadoCliente: 'activo'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al crear cliente', error: e.message });
  }
};

// Actualizar cliente
clienteCtl.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { cedulaCliente, nombreCliente, usernameCliente, direccionCliente, telefonoCliente, emailCliente, tipoCliente } = req.body;
    if (!cedulaCliente || !nombreCliente || !usernameCliente)
      return res.status(400).json({ message: 'Faltan datos obligatorios' });

    // Actualizar SQL
    await sql.promise().query(
      `UPDATE clientes SET cedulaCliente=?, nombreCliente=?, usernameCliente=?, updateCliente=? WHERE idClientes=?`,
      [cifrarDatos(cedulaCliente), cifrarDatos(nombreCliente), cifrarDatos(usernameCliente), new Date().toLocaleString(), id]
    );

    // Actualizar Mongo y devolver el registro actualizado
    const mongoCliente = await mongo.clienteModel.findOneAndUpdate(
      { idClienteSql: id },
      { $set: {
          emailCliente: cifrarDatos(emailCliente || ''),
          telefonoCliente: cifrarDatos(telefonoCliente || ''),
          direccionCliente: cifrarDatos(direccionCliente || ''),
          tipoCliente: tipoCliente || 'Regular'
        }},
      { upsert: true, new: true }
    );

    res.json({
      idClientes: id,
      cedulaCliente,
      nombreCliente,
      usernameCliente,
      correoCliente: descifrarSeguro(mongoCliente.emailCliente) || '',
      telefonoCliente: descifrarSeguro(mongoCliente.telefonoCliente) || '',
      direccionCliente: descifrarSeguro(mongoCliente.direccionCliente) || '',
      tipoCliente: mongoCliente.tipoCliente
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al actualizar cliente', error: e.message });
  }
};

// Desactivar cliente
clienteCtl.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.promise().query(`UPDATE clientes SET stadoCliente='inactivo', updateCliente=? WHERE idClientes=?`, [new Date().toLocaleString(), id]);
    res.json({ message: 'Cliente desactivado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al desactivar', error: e.message });
  }
};

module.exports = clienteCtl;
