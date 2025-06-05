// src/infrastructure/db/MysqlVarianteRepository.js

const IVarianteRepository = require('../../core/repositories/IVarianteRepository');
const Variante = require('../../core/entities/Variante');
const pool = require('./mysqlPool'); // tu pool de conexión a MySQL

/**
 * Implementación de IVarianteRepository que lee desde la vista `vistavariantesproductos`.
 */
class MysqlVarianteRepository extends IVarianteRepository {
    /**
     * Devuelve todas las variantes activas desde la vista “vistavariantesproductos”.
     * @returns {Promise<Variante[]>}
     */
    async findAllActive() {
        const [rows] = await pool.query(
            `SELECT * FROM vistavariantesproductos`
        );

        return rows.map(r => new Variante({
            varianteId: r.varianteId,
            sku: r.sku,
            productoId: r.productoId,
            productoNombre: r.productoNombre,
            color: r.color,
            talla: r.talla,
            material: r.material,
            precioVenta: r.precioVenta,
            cantidad: r.cantidad,
            imagenPrincipalUrl: r.imagenPrincipalUrl,
            createdAt: r.createdAt
        }));
    }

    /**
     * Devuelve todas las variantes activas “aplanadas” de un producto.
     * @param {number} varianteId
     * @returns {Promise<Variante|null>}
     */
    async findById(varianteId) {
        const [rows] = await pool.query(
            `SELECT * FROM vistavariantesproductos WHERE varianteId = ?`,
            [varianteId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Variante({
            varianteId: r.varianteId,
            sku: r.sku,
            productoId: r.productoId,
            productoNombre: r.productoNombre,
            color: r.color,
            talla: r.talla,
            material: r.material,
            precioVenta: r.precioVenta,
            cantidad: r.cantidad,
            imagenPrincipalUrl: r.imagenPrincipalUrl,
            createdAt: r.createdAt
        });
    }
}

module.exports = MysqlVarianteRepository;
