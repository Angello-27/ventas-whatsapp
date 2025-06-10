// src/infrastructure/db/MysqlProductoRepository.js
const IProductoRepository = require('../../core/repositories/IProductoRepository');
const Producto = require('../../core/entities/Producto');
const pool = require('./mysqlPool');

class MysqlProductoRepository extends IProductoRepository {
    async findAllActive() {
        const [rows] = await pool.query('SELECT * FROM vista_productos_completos');
        return rows.map(row => new Producto(row));
    }
}

module.exports = MysqlProductoRepository;
