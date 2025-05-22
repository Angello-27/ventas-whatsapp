const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaStockPrecioRepository {
    /**
     * Busca stock/precio en la vista según una lista de keywords.
     * No filtra por isActive porque la vista no lo expone.
     */
    async findByKeywords(keywords) {
        if (!keywords.length) return [];
        const likes = keywords.map(_ => `(SKU LIKE ? OR AlmacenNombre LIKE ?)`).join(' OR ');
        const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`]);

        const sql = `
      SELECT
        InventarioId   AS inventarioId,
        EnvaseId       AS envaseId,
        SKU            AS sku,
        AlmacenId      AS almacenId,
        AlmacenNombre  AS almacenNombre,
        Cantidad       AS cantidad,
        TipoPrecio     AS tipoPrecio,
        UmbralCantidad AS umbralCantidad,
        Monto          AS monto,
        VigenteDesde   AS vigenteDesde,
        VigenteHasta   AS vigenteHasta
      FROM v_stock_price
      WHERE ${likes}
    `;
        const [rows] = await pool.query(sql, params);
        return rows;
    }
}

module.exports = VistaStockPrecioRepository;
