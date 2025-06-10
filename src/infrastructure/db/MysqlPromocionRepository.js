// src/infrastructure/db/MysqlPromocionRepository.js
const IPromocionRepository = require('../../core/repositories/IPromocionRepository');
const Promocion = require('../../core/entities/Promocion');
const pool = require('./mysqlPool');

class MysqlPromocionRepository extends IPromocionRepository {
    async findAllActive() {
        const [rows] = await pool.query('SELECT * FROM vista_promociones');
        return rows.map(row => new Promocion(row));
    }
}

module.exports = MysqlPromocionRepository;
