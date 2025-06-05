// src/infrastructure/db/MysqlProductoRepository.js

const IProductoRepository = require('../../core/repositories/IProductoRepository');
const Producto = require('../../core/entities/Producto');
const pool = require('./mysqlPool');

class MysqlProductoRepository extends IProductoRepository {
    /**
     * Devuelve todos los productos activos desde la vista “vistaproductos”.
     * @returns {Promise<Producto[]>}
     */
    async findAllActive() {
        const [rows] = await pool.query(
            `SELECT *
       FROM vistaproductos`
        );
        return rows.map(r => new Producto({
            productoId: r.productoId,
            nombre: r.nombre,
            genero: r.genero,
            marcaId: r.marcaId,
            marcaNombre: r.marcaNombre,
            logoUrl: logoUrl,
            categoriaId: r.categoriaId,
            categoriaNombre: r.categoriaNombre,
            createdAt: r.createdAt
        }));
    }

    /**
     * Busca un producto “plano” por su ID.
     * @param {number} productoId
     * @returns {Promise<Producto|null>}
     */
    async findById(productoId) {
        const [rows] = await pool.query(
            `SELECT *
       FROM vistaproductos
       WHERE productoId = ?`,
            [productoId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Producto({
            productoId: r.productoId,
            nombre: r.nombre,
            genero: r.genero,
            marcaId: r.marcaId,
            marcaNombre: r.marcaNombre,
            logoUrl: logoUrl,
            categoriaId: r.categoriaId,
            categoriaNombre: r.categoriaNombre,
            createdAt: r.createdAt
        });
    }

    /**
     * Busca los productos activos filtrando por marcaId (en la vista plana).
     * @param {number} marcaId
     * @returns {Promise<Producto[]>}
     */
    async findByMarca(marcaId) {
        const [rows] = await pool.query(
            `SELECT *
       FROM vistaproductos
       WHERE marcaId = ?`,
            [marcaId]
        );
        return rows.map(r => new Producto({
            productoId: r.productoId,
            nombre: r.nombre,
            genero: r.genero,
            marcaId: r.marcaId,
            marcaNombre: r.marcaNombre,
            logoUrl: logoUrl,
            categoriaId: r.categoriaId,
            categoriaNombre: r.categoriaNombre,
            createdAt: r.createdAt
        }));
    }

    /**
     * Busca los productos activos filtrando por categoríaId (en la vista plana).
     * @param {number} categoriaId
     * @returns {Promise<Producto[]>}
     */
    async findByCategoria(categoriaId) {
        const [rows] = await pool.query(
            `SELECT *
       FROM vistaproductos
       WHERE categoriaId = ?`,
            [categoriaId]
        );
        return rows.map(r => new Producto({
            productoId: r.productoId,
            nombre: r.nombre,
            genero: r.genero,
            marcaId: r.marcaId,
            marcaNombre: r.marcaNombre,
            logoUrl: logoUrl,
            categoriaId: r.categoriaId,
            categoriaNombre: r.categoriaNombre,
            createdAt: r.createdAt
        }));
    }
}

module.exports = MysqlProductoRepository;
