const promotionsCtl = {};
const orm = require('../../../infrastructure/database/connection/dataBase.orm');
const sql = require('../../../infrastructure/database/connection/dataBase.sql');
const { cifrarDatos, descifrarDatos } = require('../../../application/encrypDates');

// 🔐 DESCIFRADO SEGURO (OBLIGATORIO)
const descifrarSeguro = (dato) => {
    try {
        return dato ? descifrarDatos(dato) : '';
    } catch (error) {
        return dato; // fallback: devuelve el valor original
    }
};

// ================= PROMOCIONES =================

// Mostrar promociones activas
promotionsCtl.mostrarPromociones = async (req, res) => {
    try {
        const [promociones] = await sql.promise().query(`
            SELECT *
            FROM promotions
            WHERE statePromotion = 1
            ORDER BY startDate DESC
        `);

        const promocionesDescifradas = promociones.map(promo => ({
            ...promo,
            namePromotion: descifrarSeguro(promo.namePromotion),
            promoCode: descifrarSeguro(promo.promoCode)
        }));

        return res.json(promocionesDescifradas);
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
            // 🔐 CIFRADO SOLO TEXTO
            namePromotion: cifrarDatos(namePromotion),
            promoCode: promoCode ? cifrarDatos(promoCode) : null,

            // ❌ NO CIFRAR
            typePromotion,
            discountType,
            discountValue,
            eventId: eventId || null,
            productId: productId || null,
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
                promoCode = ?,
                typePromotion = ?,
                discountType = ?,
                discountValue = ?,
                eventId = ?,
                productId = ?,
                startDate = ?,
                endDate = ?,
                maxQuota = ?,
                minPurchase = ?,
                updatePromotion = ?
            WHERE idPromotion = ?
        `, [
            cifrarDatos(namePromotion),
            promoCode ? cifrarDatos(promoCode) : null,
            typePromotion,
            discountType,
            discountValue,
            eventId || null,
            productId || null,
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

// Eliminar promoción (soft delete)
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

        const promocionesDescifradas = promociones.map(promo => ({
            ...promo,
            namePromotion: descifrarSeguro(promo.namePromotion),
            promoCode: descifrarSeguro(promo.promoCode)
        }));

        return res.json(promocionesDescifradas);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener promociones vigentes',
            error: error.message
        });
    }
};

module.exports = promotionsCtl;