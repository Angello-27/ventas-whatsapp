// infrastructure/db/MysqlPromocionRepository.js

const IPromocionRepository = require('../../core/repositories/IPromocionRepository');
const Promocion = require('../../core/entities/Promocion');
const pool = require('./mysqlPool');

class MysqlPromocionRepository extends IPromocionRepository {
    /**
     * Devuelve todas las promociones activas (hoy entre fechaInicio y fechaFin).
     * @returns {Promise<Promocion[]>}
     */
    async findAllActive() {
        const [rows] = await pool.query(
            `SELECT PromocionId, Titulo, DescuentoPct, FechaInicio, FechaFin, Activa, createdAt
         FROM promociones
         WHERE Activa = 1
           AND NOW() BETWEEN FechaInicio AND FechaFin`
        );
        return rows.map(r => new Promocion({
            promocionId: r.PromocionId,
            titulo: r.Titulo,
            descuentoPct: r.DescuentoPct,
            fechaInicio: r.FechaInicio,
            fechaFin: r.FechaFin,
            activa: Boolean(r.Activa),
            createdAt: r.createdAt
        }));
    }

    /**
     * Devuelve promociones activas que apliquen a cierto producto (por productoId).
     * Se asume que existe tabla Promocion_Variantes que relaciona PromocionId con VarianteId,
     * y que productovariantes tiene ProductoId.
     * @param {number} productoId
     * @returns {Promise<Promocion[]>}
     */
    async findActiveByProductoId(productoId) {
        const [rows] = await pool.query(
            `SELECT DISTINCT p.PromocionId, p.Titulo, p.DescuentoPct, p.FechaInicio, p.FechaFin, p.Activa, p.createdAt
         FROM promociones p
         JOIN promocion_variantes pv ON p.PromocionId = pv.PromocionId
         JOIN productovariantes v ON pv.VarianteId = v.VarianteId
         WHERE p.Activa = 1
           AND NOW() BETWEEN p.FechaInicio AND p.FechaFin
           AND v.ProductoId = ?`,
            [productoId]
        );
        return rows.map(r => new Promocion({
            promocionId: r.PromocionId,
            titulo: r.Titulo,
            descuentoPct: r.DescuentoPct,
            fechaInicio: r.FechaInicio,
            fechaFin: r.FechaFin,
            activa: Boolean(r.Activa),
            createdAt: r.createdAt
        }));
    }

    /**
     * Devuelve promociones activas que apliquen a cierta categoría (por categoriaId).
     * @param {number} categoriaId
     * @returns {Promise<Promocion[]>}
     */
    async findActiveByCategoriaId(categoriaId) {
        const [rows] = await pool.query(
            `SELECT DISTINCT p.PromocionId, p.Titulo, p.DescuentoPct, p.FechaInicio, p.FechaFin, p.Activa, p.createdAt
         FROM promociones p
         JOIN promocion_variantes pv ON p.PromocionId = pv.PromocionId
         JOIN productovariantes v ON pv.VarianteId = v.VarianteId
         JOIN productos pr ON v.ProductoId = pr.ProductoId
         WHERE p.Activa = 1
           AND NOW() BETWEEN p.FechaInicio AND p.FechaFin
           AND pr.CategoriaId = ?`,
            [categoriaId]
        );
        return rows.map(r => new Promocion({
            promocionId: r.PromocionId,
            titulo: r.Titulo,
            descuentoPct: r.DescuentoPct,
            fechaInicio: r.FechaInicio,
            fechaFin: r.FechaFin,
            activa: Boolean(r.Activa),
            createdAt: r.createdAt,
        }));
    }
}

module.exports = MysqlPromocionRepository;
