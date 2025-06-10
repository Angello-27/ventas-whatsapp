// src/infrastructure/db/MysqlPromocionProductoRepository.js
const IPromocionProductoRepository = require('../../core/repositories/IPromocionProductoRepository');
const PromocionProducto = require('../../core/entities/PromocionProducto');
const pool = require('./mysqlPool');

class MysqlPromocionProductoRepository extends IPromocionProductoRepository {
    async findAllActive() {
        const [rows] = await pool.query('SELECT * FROM vista_promociones_productos');
        return rows.map(row => new PromocionProducto(row));
    }
}

module.exports = MysqlPromocionProductoRepository;
