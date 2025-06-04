// infrastructure/db/MysqlProductoRepository.js

const IProductoRepository = require('../../core/repositories/IProductoRepository');
const Producto = require('../../core/entities/Producto');
const pool = require('./mysqlPool');

class MysqlProductoRepository extends IProductoRepository {
    /**
     * Devuelve todos los productos activos.
     * @returns {Promise<Producto[]>}
     */
    async findAllActive() {
        const [rows] = await pool.query(
            `SELECT ProductoId, Nombre, Genero, MarcaId, CategoriaId, isActive, createdAt, updatedAt
         FROM productos
         WHERE isActive = 1`
        );
        return rows.map(r => new Producto({
            productoId: r.ProductoId,
            nombre: r.Nombre,
            genero: r.Genero,
            marcaId: r.MarcaId,
            categoriaId: r.CategoriaId,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));
    }

    /**
     * Busca un producto por su ID.
     * @param {number} productoId
     * @returns {Promise<Producto|null>}
     */
    async findById(productoId) {
        const [rows] = await pool.query(
            `SELECT ProductoId, Nombre, Genero, MarcaId, CategoriaId, isActive, createdAt, updatedAt
         FROM productos
         WHERE ProductoId = ?`,
            [productoId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Producto({
            productoId: r.ProductoId,
            nombre: r.Nombre,
            genero: r.Genero,
            marcaId: r.MarcaId,
            categoriaId: r.CategoriaId,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Busca productos activos por marca.
     * @param {number} marcaId
     * @returns {Promise<Producto[]>}
     */
    async findByMarca(marcaId) {
        const [rows] = await pool.query(
            `SELECT ProductoId, Nombre, Genero, MarcaId, CategoriaId, isActive, createdAt, updatedAt
         FROM productos
         WHERE isActive = 1 AND MarcaId = ?`,
            [marcaId]
        );
        return rows.map(r => new Producto({
            productoId: r.ProductoId,
            nombre: r.Nombre,
            genero: r.Genero,
            marcaId: r.MarcaId,
            categoriaId: r.CategoriaId,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));
    }

    /**
     * Busca productos activos por categoría.
     * @param {number} categoriaId
     * @returns {Promise<Producto[]>}
     */
    async findByCategoria(categoriaId) {
        const [rows] = await pool.query(
            `SELECT ProductoId, Nombre, Genero, MarcaId, CategoriaId, isActive, createdAt, updatedAt
         FROM productos
         WHERE isActive = 1 AND CategoriaId = ?`,
            [categoriaId]
        );
        return rows.map(r => new Producto({
            productoId: r.ProductoId,
            nombre: r.Nombre,
            genero: r.Genero,
            marcaId: r.MarcaId,
            categoriaId: r.CategoriaId,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));
    }
}

module.exports = MysqlProductoRepository;
