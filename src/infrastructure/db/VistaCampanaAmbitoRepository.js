const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaCampanaAmbitoRepository {
    /**
     * Devuelve todas las campañas activas junto a su ámbito.
     */
    async findActive() {
        const [rows] = await pool.query(
            `SELECT
         CampanaId       AS campanaId,
         CampanaNombre   AS campanaNombre,
         Tipo            AS tipo,
         FechaInicio     AS fechaInicio,
         FechaFin        AS fechaFin,
         Parámetros      AS parametros,
         AlcanceId       AS alcanceId,
         TipoAmbito      AS tipoAmbito,
         ObjetoId        AS objetoId
       FROM v_campana_ambito
       WHERE FechaInicio <= NOW() AND FechaFin >= NOW()`
        );
        return rows;
    }
}

module.exports = VistaCampanaAmbitoRepository;
