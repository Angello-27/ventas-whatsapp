// src/infrastructure/db/MysqlProductoVarianteRepository.js
const IProductoVarianteRepository = require('../../core/repositories/IProductoVarianteRepository');
const ProductoVariante = require('../../core/entities/ProductoVariante');
const pool = require('./mysqlPool');

class MysqlProductoVarianteRepository extends IProductoVarianteRepository {
    async findAllActive() {
        const [rows] = await pool.query('SELECT * FROM vista_variantes_productos');
        return rows.map(row => new ProductoVariante(row));F
    }
}

module.exports = MysqlProductoVarianteRepository;
