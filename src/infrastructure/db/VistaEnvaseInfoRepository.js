const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaEnvaseInfoRepository {
    /**
     * Información de envases incluyendo nombre de producto.
     */
    async findByEnvaseId(envaseId) {
        const [rows] = await pool.query(
            `SELECT
         EnvaseId          AS envaseId,
         SKU               AS sku,
         Descripcion       AS descripcion,
         ProductoId        AS productoId,
         ProductoNombre    AS productoNombre,
         Atributos         AS atributos
       FROM v_envase_info
       WHERE EnvaseId = ?`,
            [envaseId]
        );
        return rows.length ? rows[0] : null;
    }
}

module.exports = VistaEnvaseInfoRepository;
