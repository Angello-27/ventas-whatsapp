const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaChatFullRepository {
    /**
     * Recupera todo el historial (mensajes entrantes y salientes)
     * para una sesión de chat.
     */
    async findBySesionId(sesionId) {
        const [rows] = await pool.query(
            `SELECT
         SesionId        AS sesionId,
         ClienteId       AS clienteId,
         ClienteNombre   AS clienteNombre,
         IniciadoEn      AS iniciadoEn,
         FinalizadoEn    AS finalizadoEn,
         MensajeId       AS mensajeId,
         FechaEnvio      AS fechaEnvio,
         Direccion       AS direccion,
         Contenido       AS contenido
       FROM v_chat_full
       WHERE SesionId = ?
       ORDER BY FechaEnvio`,
            [sesionId]
        );
        return rows;
    }
}

module.exports = VistaChatFullRepository;
