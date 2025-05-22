const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaItemOrdenFullRepository {
    /**
     * Ítems de una orden con detalles de envase.
     */
    async findByOrdenId(ordenId) {
        const [rows] = await pool.query(
            `SELECT
         ItemOrdenId        AS itemOrdenId,
         OrdenId            AS ordenId,
         EnvaseId           AS envaseId,
         SKU                AS sku,
         EnvaseDescripcion  AS envaseDescripcion,
         Cantidad           AS cantidad,
         PrecioUnitario     AS precioUnitario
       FROM v_itemorden_full
       WHERE OrdenId = ?`,
            [ordenId]
        );
        return rows;
    }
}

module.exports = VistaItemOrdenFullRepository;
