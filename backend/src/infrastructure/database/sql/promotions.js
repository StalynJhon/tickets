const promotions = (sequelize, type) => {
    return sequelize.define('promotions', {

        idPromotion: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        namePromotion: {
            type: type.STRING,
            allowNull: false
        },

        typePromotion: {
            type: type.ENUM('CODIGO', 'EVENTO', 'COMBO'),
            allowNull: false
        },

        discountType: {
            type: type.ENUM('PORCENTAJE', 'FIJO'),
            allowNull: true
        },

        discountValue: {
            type: type.DECIMAL(10, 2),
            allowNull: true
        },

        promoCode: {
            type: type.STRING,
            allowNull: true,
            unique: true
        },

        eventId: {
            type: type.INTEGER,
            allowNull: true
        },

        productId: {
            type: type.INTEGER,
            allowNull: true
        },

        startDate: {
            type: type.DATE,
            allowNull: false
        },

        endDate: {
            type: type.DATE,
            allowNull: false
        },

        maxQuota: {
            type: type.INTEGER,
            allowNull: true
        },

        currentUsage: {
            type: type.INTEGER,
            defaultValue: 0
        },

        minPurchase: {
            type: type.DECIMAL(10, 2),
            allowNull: true
        },

        statePromotion: {
            type: type.BOOLEAN,
            defaultValue: true
        },

        createPromotion: type.STRING,
        updatePromotion: type.STRING,

    }, {
        timestamps: false,
        comment: 'Tabla de Promociones y Descuentos'
    })
}

module.exports = promotions;
