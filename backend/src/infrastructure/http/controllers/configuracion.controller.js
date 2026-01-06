const SystemSettings = require('../../../domain/models/systemSettings');
const EventSettings = require('../../../domain/models/eventSettings');
const { DataTypes, Op } = require('sequelize');
const dbConnection = require('../../database/connection/dataBase.orm');

// Importar el modelo Configuracion directamente
const { Configuracion } = dbConnection;

// Función para descifrar de forma segura
const descifrarSeguro = (dato) => {
  try {
    const { descifrarDatos } = require('../../../application/services/encrypDates');
    return dato ? descifrarDatos(dato) : '';
  } catch (error) {
    console.error('Error al descifrar:', error);
    return '';
  }
};

// Función auxiliar para asegurar un único registro tipo 'general'
const ensureSingleGeneralConfig = async () => {
  // Buscar si existe algún registro tipo 'general'
  const existingConfig = await Configuracion.findOne({ where: { tipo: 'general' } });
  
  if (!existingConfig) {
    // Si no existe, crear uno con valores por defecto
    await Configuracion.create({
      tipo: 'general',
      nombreComercial: '',
      logo: '',
      colorPrimario: '',
      colorSecundario: '',
      colorFondo: '',
      emailContacto: null,
      telefonoContacto: null,
      direccionContacto: null,
      terminos: null,
      politica: null,
      mensajesCompra: null,
      moneda: null,
      limiteTickets: null,
      transporteHabilitado: null,
      productosHabilitados: null
    });
  } else {
    // Si existen múltiples registros tipo 'general', eliminar los adicionales
    const allGeneralConfigs = await Configuracion.findAll({ where: { tipo: 'general' } });
    if (allGeneralConfigs.length > 1) {
      // Mantener solo el primero, eliminar los demás
      for (let i = 1; i < allGeneralConfigs.length; i++) {
        await Configuracion.destroy({ where: { idConfiguracion: allGeneralConfigs[i].idConfiguracion } });
      }
    }
  }
};

// Obtener configuración general
const getConfiguracionGeneral = async (req, res) => {
  try {
    // Asegurar que solo exista un registro tipo 'general'
    await ensureSingleGeneralConfig();
    
    // Intentar obtener de MongoDB primero
    let configMongo = await SystemSettings.findOne({ type: 'general' });
    
    if (!configMongo) {
      try {
        // Si no existe en MongoDB, intentar obtener de MySQL
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Desencriptar datos de contacto de forma segura
          let emailDesencriptado = descifrarSeguro(data.emailContacto);
          let telefonoDesencriptado = descifrarSeguro(data.telefonoContacto);
          let direccionDesencriptada = descifrarSeguro(data.direccionContacto);
          
          // Convertir el formato de MySQL al de MongoDB para compatibilidad
          configMongo = {
            nombreComercial: data.nombreComercial,
            logo: data.logo,
            colors: {
              primario: data.colorPrimario,
              secundario: data.colorSecundario,
              fondo: data.colorFondo
            },
            contactInfo: {
              email: emailDesencriptado,
              telefono: telefonoDesencriptado,
              direccion: direccionDesencriptada
            }
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer configuración general de MySQL:', mysqlError);
      }
    }
    
    if (!configMongo) {
      return res.status(200).json({
        nombreComercial: '',
        logo: '',
        colores: {
          primario: '',
          secundario: '',
          fondo: ''
        },
        contacto: {
          email: '',
          telefono: '',
          direccion: ''
        }
      });
    }
    
    // Mapear los colores de la estructura de MongoDB a la estructura esperada por el frontend
    const coloresMapeados = configMongo.colors || {};
    
    res.status(200).json({
      nombreComercial: configMongo.nombreComercial || '',
      logo: configMongo.logo || '',
      colores: {
        primario: coloresMapeados.primary || coloresMapeados.primario || '',
        secundario: coloresMapeados.secondary || coloresMapeados.secundario || '',
        fondo: coloresMapeados.background?.from || coloresMapeados.background?.to || coloresMapeados.fondo || ''
      },
      contacto: configMongo.contactInfo || {
        email: '',
        telefono: '',
        direccion: ''
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración general:', error);
    res.status(500).json({ error: 'Error al obtener la configuración general' });
  }
};

// Guardar configuración general
const guardarConfiguracionGeneral = async (req, res) => {
  try {
    let config = await SystemSettings.findOne({ type: 'general' });
    
    const { nombreComercial, logo, colores, contacto } = req.body;
    
    // Validar que al menos uno de los campos tenga contenido
    if (!nombreComercial && !logo && !colores && !contacto) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo con contenido' });
    }
    
    if (config) {
      // Actualizar configuración existente en MongoDB
      config.nombreComercial = nombreComercial !== undefined ? nombreComercial : config.nombreComercial;
      config.logo = logo !== undefined ? logo : config.logo;
      
      // Mapear los colores del frontend a la estructura de MongoDB
      if (colores !== undefined) {
        config.colors = {
          primary: colores.primario,
          secondary: colores.secundario,
          background: {
            from: colores.fondo,
            to: colores.fondo
          }
        };
      }
      
      config.contactInfo = contacto !== undefined ? contacto : config.contactInfo;
      await config.save();
    } else {
      // Crear nueva configuración en MongoDB
      config = new SystemSettings({
        type: 'general',
        nombreComercial: nombreComercial || '',
        logo: logo || '',
        colors: {
          primary: colores?.primario,
          secondary: colores?.secundario,
          background: {
            from: colores?.fondo,
            to: colores?.fondo
          }
        },
        contactInfo: contacto || {}
      });
      await config.save();
    }
    
    // Importar funciones de encriptación
    const { cifrarDatos } = require('../../../application/services/encrypDates');
    
    // Guardar también en MySQL
    try {
      // Asegurar que solo exista un registro tipo 'general'
      await ensureSingleGeneralConfig();
      
      // Encriptar datos sensibles
      const emailContactoEnc = contacto?.email ? cifrarDatos(contacto.email) : null;
      const telefonoContactoEnc = contacto?.telefono ? cifrarDatos(contacto.telefono) : null;
      const direccionContactoEnc = contacto?.direccion ? cifrarDatos(contacto.direccion) : null;
      
      // Actualizar solo los campos proporcionados, manteniendo los existentes
      const updateData = {};
      if (nombreComercial !== undefined) updateData.nombreComercial = nombreComercial;
      if (logo !== undefined) updateData.logo = logo;
      if (colores?.primario !== undefined) updateData.colorPrimario = colores.primario;
      if (colores?.secundario !== undefined) updateData.colorSecundario = colores.secundario;
      if (colores?.fondo !== undefined) updateData.colorFondo = colores.fondo;
      if (emailContactoEnc !== null) updateData.emailContacto = emailContactoEnc;
      if (telefonoContactoEnc !== null) updateData.telefonoContacto = telefonoContactoEnc;
      if (direccionContactoEnc !== null) updateData.direccionContacto = direccionContactoEnc;
      
      await Configuracion.update(updateData, {
        where: { tipo: 'general' }
      });
    } catch (mysqlError) {
      console.error('Error al guardar configuración general en MySQL:', mysqlError);
    }
    
    res.status(200).json({ message: 'Configuración general guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar configuración general:', error);
    res.status(500).json({ error: 'Error al guardar la configuración general' });
  }
};

// Obtener textos legales
const getTextosLegales = async (req, res) => {
  try {
    // Intentar obtener de MongoDB primero
    let configMongo = await SystemSettings.findOne({ type: 'legal' });
    
    if (!configMongo) {
      try {
        // Si no existe en MongoDB, intentar obtener de MySQL
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Desencriptar textos legales de forma segura
          let terminosDesencriptado = descifrarSeguro(data.terminos);
          let politicaDesencriptada = descifrarSeguro(data.politica);
          let mensajesCompraDesencriptado = descifrarSeguro(data.mensajesCompra);
          
          // Convertir el formato de MySQL al de MongoDB para compatibilidad
          configMongo = {
            terms: terminosDesencriptado,
            privacy: politicaDesencriptada,
            purchaseMessages: mensajesCompraDesencriptado
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer textos legales de MySQL:', mysqlError);
      }
    }
    
    if (!configMongo) {
      return res.status(200).json({
        terminos: '',
        politica: '',
        mensajesCompra: ''
      });
    }
    
    res.status(200).json({
      terminos: configMongo.terms || '',
      politica: configMongo.privacy || '',
      mensajesCompra: configMongo.purchaseMessages || ''
    });
  } catch (error) {
    console.error('Error al obtener textos legales:', error);
    res.status(500).json({ error: 'Error al obtener los textos legales' });
  }
};

// Guardar textos legales
const guardarTextosLegales = async (req, res) => {
  try {
    let config = await SystemSettings.findOne({ type: 'legal' });
    
    const { terminos, politica, mensajesCompra } = req.body;
    
    // Validar que al menos uno de los campos tenga contenido
    if (!terminos && !politica && !mensajesCompra) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo con contenido' });
    }
    
    if (config) {
      // Actualizar configuración existente en MongoDB
      config.terms = terminos !== undefined ? terminos : config.terms;
      config.privacy = politica !== undefined ? politica : config.privacy;
      config.purchaseMessages = mensajesCompra !== undefined ? mensajesCompra : config.purchaseMessages;
      await config.save();
    } else {
      // Crear nueva configuración en MongoDB
      config = new SystemSettings({
        type: 'legal',
        terms: terminos || '',
        privacy: politica || '',
        purchaseMessages: mensajesCompra || ''
      });
      await config.save();
    }
    
    // Importar funciones de encriptación
    const { cifrarDatos } = require('../../../application/services/encrypDates');
    
    // Guardar también en MySQL
    try {
      // Asegurar que solo exista un registro tipo 'general'
      await ensureSingleGeneralConfig();
      
      // Encriptar datos sensibles
      const terminosEnc = terminos ? cifrarDatos(terminos) : null;
      const politicaEnc = politica ? cifrarDatos(politica) : null;
      const mensajesCompraEnc = mensajesCompra ? cifrarDatos(mensajesCompra) : null;
      
      // Actualizar solo los campos proporcionados, manteniendo los existentes
      const updateData = {};
      if (terminosEnc !== null) updateData.terminos = terminosEnc;
      if (politicaEnc !== null) updateData.politica = politicaEnc;
      if (mensajesCompraEnc !== null) updateData.mensajesCompra = mensajesCompraEnc;
      
      await Configuracion.update(updateData, {
        where: { tipo: 'general' }
      });
    } catch (mysqlError) {
      console.error('Error al guardar textos legales en MySQL:', mysqlError);
    }
    
    res.status(200).json({ message: 'Textos legales guardados correctamente' });
  } catch (error) {
    console.error('Error al guardar textos legales:', error);
    res.status(500).json({ error: 'Error al guardar los textos legales' });
  }
};

// Obtener configuración de negocio
const getConfiguracionNegocio = async (req, res) => {
  try {
    // Intentar obtener de MongoDB primero
    let configMongo = await SystemSettings.findOne({ type: 'business' });
    
    if (!configMongo) {
      try {
        // Si no existe en MongoDB, intentar obtener de MySQL
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Convertir el formato de MySQL al de MongoDB para compatibilidad
          configMongo = {
            paymentConfig: {
              defaultCurrency: data.moneda || 'USD'
            },
            businessConfig: {
              maxSeatsPerReservation: data.limiteTickets || 10,
              enableTransport: data.transporteHabilitado || true,
              enableProducts: data.productosHabilitados || true
            }
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer configuración de negocio de MySQL:', mysqlError);
      }
    }
    
    if (!configMongo) {
      return res.status(200).json({
        moneda: 'USD',
        limiteTickets: 10,
        transporteHabilitado: true,
        productosHabilitados: true
      });
    }
    
    res.status(200).json({
      moneda: configMongo.paymentConfig?.defaultCurrency || 'USD',
      limiteTickets: configMongo.businessConfig?.maxSeatsPerReservation || 10,
      transporteHabilitado: configMongo.businessConfig?.enableTransport || true,
      productosHabilitados: configMongo.businessConfig?.enableProducts || true
    });
  } catch (error) {
    console.error('Error al obtener configuración de negocio:', error);
    res.status(500).json({ error: 'Error al obtener la configuración de negocio' });
  }
};

// Guardar configuración de negocio
const guardarConfiguracionNegocio = async (req, res) => {
  try {
    let config = await SystemSettings.findOne({ type: 'business' });
    
    const { moneda, limiteTickets, transporteHabilitado, productosHabilitados } = req.body;
    
    // Validar que al menos uno de los campos tenga contenido
    if (moneda === undefined && limiteTickets === undefined && transporteHabilitado === undefined && productosHabilitados === undefined) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo con contenido' });
    }
    
    if (config) {
      // Actualizar configuración existente en MongoDB
      config.paymentConfig = {
        ...config.paymentConfig,
        defaultCurrency: moneda !== undefined ? moneda : config.paymentConfig?.defaultCurrency
      };
      config.businessConfig = {
        ...config.businessConfig,
        maxSeatsPerReservation: limiteTickets !== undefined ? limiteTickets : config.businessConfig?.maxSeatsPerReservation,
        enableTransport: transporteHabilitado !== undefined ? transporteHabilitado : config.businessConfig?.enableTransport,
        enableProducts: productosHabilitados !== undefined ? productosHabilitados : config.businessConfig?.enableProducts
      };
      await config.save();
    } else {
      // Crear nueva configuración en MongoDB
      config = new SystemSettings({
        type: 'business',
        paymentConfig: {
          defaultCurrency: moneda || 'USD'
        },
        businessConfig: {
          maxSeatsPerReservation: limiteTickets !== undefined ? limiteTickets : 10,
          enableTransport: transporteHabilitado !== undefined ? transporteHabilitado : true,
          enableProducts: productosHabilitados !== undefined ? productosHabilitados : true
        }
      });
      await config.save();
    }
    
    // Importar funciones de encriptación
    const { cifrarDatos } = require('../../../application/services/encrypDates');
    
    // Guardar también en MySQL
    try {
      // Asegurar que solo exista un registro tipo 'general'
      await ensureSingleGeneralConfig();
      
      // Actualizar solo los campos proporcionados, manteniendo los existentes
      const updateData = {};
      if (moneda !== undefined) updateData.moneda = moneda;
      if (limiteTickets !== undefined) updateData.limiteTickets = limiteTickets;
      if (transporteHabilitado !== undefined) updateData.transporteHabilitado = transporteHabilitado;
      if (productosHabilitados !== undefined) updateData.productosHabilitados = productosHabilitados;
      
      await Configuracion.update(updateData, {
        where: { tipo: 'general' }
      });
    } catch (mysqlError) {
      console.error('Error al guardar configuración de negocio en MySQL:', mysqlError);
    }
    
    res.status(200).json({ message: 'Configuración de negocio guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar configuración de negocio:', error);
    res.status(500).json({ error: 'Error al guardar la configuración de negocio' });
  }
};

// Obtener información de la empresa (para clientes)
const getInfoEmpresa = async (req, res) => {
  try {
    // Intentar obtener de MongoDB primero
    const [generalConfigMongo, legalConfigMongo] = await Promise.all([
      SystemSettings.findOne({ type: 'general' }),
      SystemSettings.findOne({ type: 'legal' })
    ]);
    
    let generalConfig = generalConfigMongo;
    let legalConfig = legalConfigMongo;
    
    // Si no hay configuración en MongoDB, intentar obtener de MySQL
    if (!generalConfig) {
      try {
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Desencriptar datos de contacto de forma segura
          let emailDesencriptado = descifrarSeguro(data.emailContacto);
          let telefonoDesencriptado = descifrarSeguro(data.telefonoContacto);
          let direccionDesencriptada = descifrarSeguro(data.direccionContacto);
          
          generalConfig = {
            nombreComercial: data.nombreComercial,
            logo: data.logo,
            contactInfo: {
              email: emailDesencriptado,
              telefono: telefonoDesencriptado,
              direccion: direccionDesencriptada
            }
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer configuración general de MySQL:', mysqlError);
      }
    }
    
    if (!legalConfig) {
      try {
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Desencriptar textos legales de forma segura
          let terminosDesencriptado = descifrarSeguro(data.terminos);
          let politicaDesencriptada = descifrarSeguro(data.politica);
          let mensajesCompraDesencriptado = descifrarSeguro(data.mensajesCompra);
          
          legalConfig = {
            terms: terminosDesencriptado,
            privacy: politicaDesencriptada,
            purchaseMessages: mensajesCompraDesencriptado
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer textos legales de MySQL:', mysqlError);
      }
    }
    
    const response = {
      nombreComercial: generalConfig?.nombreComercial || '',
      logo: generalConfig?.logo || '',
      contacto: generalConfig?.contactInfo || {
        email: '',
        telefono: '',
        direccion: ''
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener información de la empresa:', error);
    res.status(500).json({ error: 'Error al obtener la información de la empresa' });
  }
};

// Obtener términos y condiciones (para clientes)
const getTerminosCondiciones = async (req, res) => {
  try {
    // Intentar obtener de MongoDB primero
    let configMongo = await SystemSettings.findOne({ type: 'legal' });
    
    if (!configMongo) {
      try {
        // Si no existe en MongoDB, intentar obtener de MySQL
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Desencriptar términos y condiciones de forma segura
          let terminosDesencriptado = descifrarSeguro(data.terminos);
          
          // Convertir el formato de MySQL al de MongoDB para compatibilidad
          configMongo = {
            terms: terminosDesencriptado
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer términos y condiciones de MySQL:', mysqlError);
      }
    }
    
    if (!configMongo) {
      return res.status(200).json({
        texto: 'No hay términos y condiciones disponibles actualmente.'
      });
    }
    
    res.status(200).json({
      texto: configMongo.terms || 'No hay términos y condiciones disponibles actualmente.'
    });
  } catch (error) {
    console.error('Error al obtener términos y condiciones:', error);
    res.status(500).json({ error: 'Error al obtener los términos y condiciones' });
  }
};

// Obtener política de privacidad (para clientes)
const getPoliticaPrivacidad = async (req, res) => {
  try {
    // Intentar obtener de MongoDB primero
    let configMongo = await SystemSettings.findOne({ type: 'legal' });
    
    if (!configMongo) {
      try {
        // Si no existe en MongoDB, intentar obtener de MySQL
        const configMysql = await Configuracion.findOne({ where: { tipo: 'general' } });
        if (configMysql) {
          const data = configMysql.toJSON();
          
          // Importar funciones de desencriptación
          const { descifrarDatos } = require('../../../application/services/encrypDates');
          
          // Desencriptar política de privacidad de forma segura
          let politicaDesencriptada = descifrarSeguro(data.politica);
          
          // Convertir el formato de MySQL al de MongoDB para compatibilidad
          configMongo = {
            privacy: politicaDesencriptada
          };
        }
      } catch (mysqlError) {
        console.error('Error al leer política de privacidad de MySQL:', mysqlError);
      }
    }
    
    if (!configMongo) {
      return res.status(200).json({
        texto: 'No hay política de privacidad disponible actualmente.'
      });
    }
    
    res.status(200).json({
      texto: configMongo.privacy || 'No hay política de privacidad disponible actualmente.'
    });
  } catch (error) {
    console.error('Error al obtener política de privacidad:', error);
    res.status(500).json({ error: 'Error al obtener la política de privacidad' });
  }
};

// Obtener ayuda/FAQ (para clientes)
const getAyudaFAQ = async (req, res) => {
  try {
    // Por ahora, devolver una respuesta estándar
    // En el futuro, esto podría venir de una base de datos
    res.status(200).json({
      faqs: [
        {
          pregunta: '¿Cómo compro entradas?',
          respuesta: 'Puedes navegar por nuestros eventos disponibles, seleccionar el evento que te interesa, elegir la cantidad de entradas y completar el proceso de pago.'
        },
        {
          pregunta: '¿Puedo devolver mis entradas?',
          respuesta: 'Las políticas de devolución dependen de cada evento. Por favor revisa los términos específicos del evento antes de realizar tu compra.'
        },
        {
          pregunta: '¿Cómo puedo contactar al soporte?',
          respuesta: 'Puedes contactarnos a través de nuestro formulario de contacto o enviar un correo electrónico a soporte@ejemplo.com.'
        }
      ]
    });
  } catch (error) {
    console.error('Error al obtener ayuda/FAQ:', error);
    res.status(500).json({ error: 'Error al obtener la ayuda y preguntas frecuentes' });
  }
};

module.exports = {
  getConfiguracionGeneral,
  guardarConfiguracionGeneral,
  getTextosLegales,
  guardarTextosLegales,
  getConfiguracionNegocio,
  guardarConfiguracionNegocio,
  getInfoEmpresa,
  getTerminosCondiciones,
  getPoliticaPrivacidad,
  getAyudaFAQ
};