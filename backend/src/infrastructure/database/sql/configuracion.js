const Configuracion = (sequelize, DataTypes) => {
  return sequelize.define('configuracion', {
    idConfiguracion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nombreComercial: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    colorPrimario: {
      type: DataTypes.STRING(7), // Formato hexadecimal #FFFFFF
      allowNull: true
    },
    colorSecundario: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    colorFondo: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    emailContacto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefonoContacto: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    direccionContacto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terminos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    politica: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mensajesCompra: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    moneda: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'USD'
    },
    limiteTickets: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    },
    transporteHabilitado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    productosHabilitados: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    tableName: 'configuracion',
    timestamps: true
  });
};

module.exports = Configuracion;