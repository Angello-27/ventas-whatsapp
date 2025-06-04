// infrastructure/db/MysqlVarianteRepository.js

const IVarianteRepository = require('../../core/repositories/IVarianteRepository');
const Variante = require('../../core/entities/Variante');
const pool = require('./mysqlPool');

class MysqlVarianteRepository extends IVarianteRepository {
    /**
     * Devuelve todas las variantes asociadas a un producto.
     * @param {number} productoId
     * @returns {Promise<Variante[]>}
     */
    async findByProductoId(productoId) {
        const [rows] = await pool.query(
            `SELECT VarianteId, ProductoId, Color, Talla, Material, SKU, PrecioVenta, Cantidad, Activo AS isActive, createdAt, updatedAt
         FROM productovariantes
         WHERE ProductoId = ? AND Activo = 1`,
            [productoId]
        );
        return rows.map(r => new Variante({
            varianteId: r.VarianteId,
            productoId: r.ProductoId,
            color: r.Color,
            talla: r.Talla,
            material: r.Material,
            sku: r.SKU,
            precioVenta: r.PrecioVenta,
            cantidad: r.Cantidad,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));
    }

    /**
     * Busca una variante por su ID.
     * @param {number} varianteId
     * @returns {Promise<Variante|null>}
     */
    async findById(varianteId) {
        const [rows] = await pool.query(
            `SELECT VarianteId, ProductoId, Color, Talla, Material, SKU, PrecioVenta, Cantidad, Activo AS isActive, createdAt, updatedAt
         FROM productovariantes
         WHERE VarianteId = ?`,
            [varianteId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Variante({
            varianteId: r.VarianteId,
            productoId: r.ProductoId,
            color: r.Color,
            talla: r.Talla,
            material: r.Material,
            sku: r.SKU,
            precioVenta: r.PrecioVenta,
            cantidad: r.Cantidad,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Guarda o actualiza una variante.
     * @param {{
     *   varianteId?: number,
     *   productoId: number,
     *   color: string,
     *   talla: string,
     *   material?: string,
     *   sku: string,
     *   precioVenta: number,
     *   cantidad: number,
     *   isActive?: boolean
     * }} data
     * @returns {Promise<Variante>}
     */
    async saveOrUpdate({ varianteId, productoId, color, talla, material = null, sku, precioVenta, cantidad, isActive = true }) {
        if (varianteId) {
            // Actualizar
            await pool.query(
                `UPDATE productovariantes
           SET ProductoId = ?, Color = ?, Talla = ?, Material = ?, SKU = ?, PrecioVenta = ?, Cantidad = ?, Activo = ?, updatedAt = NOW()
         WHERE VarianteId = ?`,
                [productoId, color, talla, material, sku, precioVenta, cantidad, isActive ? 1 : 0, varianteId]
            );
            return this.findById(varianteId);
        } else {
            // Insertar
            const [result] = await pool.query(
                `INSERT INTO productovariantes (ProductoId, Color, Talla, Material, SKU, PrecioVenta, Cantidad, Activo, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [productoId, color, talla, material, sku, precioVenta, cantidad, isActive ? 1 : 0]
            );
            const insertId = result.insertId;
            return this.findById(insertId);
        }
    }
}

module.exports = MysqlVarianteRepository;
