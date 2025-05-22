const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaCampanaItemsRepository {
    /**
     * Obtiene todos los ítems (envases) de una campaña concreta.
     */
    async findByCampanaId(campanaId) {
        const [rows] = await pool.query(
            `SELECT
         ItemId             AS itemId,
         CampanaId          AS campanaId,
         EnvaseId           AS envaseId,
         SKU                AS sku,
         EnvaseDescripcion  AS envaseDescripcion,
         Cantidad           AS cantidad
       FROM v_campana_items
       WHERE CampanaId = ?`,
            [campanaId]
        );
        return rows;
    }
}

module.exports = VistaCampanaItemsRepository;
