const promotionsCtl = {};
const orm = require('../../../infrastructure/database/connection/dataBase.orm');
const sql = require('../../../infrastructure/database/connection/dataBase.sql');

// ================= PROMOCIONES =================

// Mostrar todas las promociones activas
promotionsCtl.mostrarPromociones = async (req, res) => {
    try {
        const [promociones] = await sql.promise().query(`
            SELECT *
            FROM promotions
            WHERE statePromotion = 1
            ORDER BY startDate DESC
        `);

        return res.json(promociones);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener promociones',
            error: error.message
        });
    }
};

// Crear promoción
promotionsCtl.crearPromocion = async (req, res) => {
    try {
        const {
            namePromotion,
            typePromotion,
            discountType,
            discountValue,
            promoCode,
            eventId,
            productId,
            startDate,
            endDate,
            maxQuota,
            minPurchase
        } = req.body;

        // Validaciones obligatorias según tabla
        if (!namePromotion || !typePromotion || !startDate || !endDate) {
            return res.status(400).json({
                message: 'Todos los campos obligatorios deben ser enviados'
            });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                message: 'La fecha de inicio debe ser menor a la fecha fin'
            });
        }

        const nuevaPromocion = await orm.Promotion.create({
            namePromotion,
            typePromotion,
            discountType,
            discountValue,
            promoCode,
            eventId,
            productId,
            startDate,
            endDate,
            maxQuota,
            minPurchase,
            statePromotion: true,
            createPromotion: new Date().toLocaleString()
        });

        return res.status(201).json({
            message: 'Promoción creada correctamente',
            idPromotion: nuevaPromocion.idPromotion
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear la promoción',
            error: error.message
        });
    }
};

// Actualizar promoción
promotionsCtl.actualizarPromocion = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            namePromotion,
            typePromotion,
            discountType,
            discountValue,
            promoCode,
            eventId,
            productId,
            startDate,
            endDate,
            maxQuota,
            minPurchase
        } = req.body;

        const [promoExiste] = await sql.promise().query(
            'SELECT idPromotion FROM promotions WHERE idPromotion = ? AND statePromotion = 1',
            [id]
        );

        if (promoExiste.length === 0) {
            return res.status(404).json({ message: 'Promoción no encontrada' });
        }

        await sql.promise().query(`
            UPDATE promotions SET
                namePromotion = ?,
                typePromotion = ?,
                discountType = ?,
                discountValue = ?,
                promoCode = ?,
                eventId = ?,
                productId = ?,
                startDate = ?,
                endDate = ?,
                maxQuota = ?,
                minPurchase = ?,
                updatePromotion = ?
            WHERE idPromotion = ?
        `, [
            namePromotion,
            typePromotion,
            discountType,
            discountValue,
            promoCode,
            eventId,
            productId,
            startDate,
            endDate,
            maxQuota,
            minPurchase,
            new Date().toLocaleString(),
            id
        ]);

        return res.json({ message: 'Promoción actualizada correctamente' });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar la promoción',
            error: error.message
        });
    }
};

// Eliminar (desactivar) promoción
promotionsCtl.eliminarPromocion = async (req, res) => {
    try {
        const { id } = req.params;

        await sql.promise().query(
            'UPDATE promotions SET statePromotion = 0, updatePromotion = ? WHERE idPromotion = ?',
            [new Date().toLocaleString(), id]
        );

        return res.json({ message: 'Promoción desactivada correctamente' });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar la promoción',
            error: error.message
        });
    }
};

// Obtener promociones vigentes
promotionsCtl.obtenerPromocionesVigentes = async (req, res) => {
    try {
        const [promociones] = await sql.promise().query(`
            SELECT *
            FROM promotions
            WHERE statePromotion = 1
            AND NOW() BETWEEN startDate AND endDate
            ORDER BY discountValue DESC
        `);

        return res.json(promociones);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener promociones vigentes',
            error: error.message
        });
    }
};

module.exports = promotionsCtl;
