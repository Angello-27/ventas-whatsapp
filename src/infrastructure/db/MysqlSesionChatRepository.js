// infrastructure/db/MysqlSesionChatRepository.js

const ISesionChatRepository = require('../../core/repositories/ISesionChatRepository');
const SesionChat = require('../../core/entities/SesionChat');
const pool = require('./mysqlPool');

class MysqlSesionChatRepository extends ISesionChatRepository {
    /**
     * Busca la sesión activa de un cliente (sin finalizadoEn y isActive = 1).
     * @param {number} clienteId
     * @returns {Promise<SesionChat|null>}
     */
    async findActiveByClienteId(clienteId) {
        const [rows] = await pool.query(
            `SELECT SesionId, ClienteId, IniciadoEn, FinalizadoEn, isActive, createdAt, updatedAt
         FROM sesionchat
         WHERE ClienteId = ?
           AND FinalizadoEn IS NULL
           AND isActive = 1
         LIMIT 1`,
            [clienteId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new SesionChat({
            sesionId: r.SesionId,
            clienteId: r.ClienteId,
            iniciadoEn: r.IniciadoEn,
            finalizadoEn: r.FinalizadoEn,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Crea una nueva sesión para un cliente.
     * @param {{ clienteId: number }} data
     * @returns {Promise<SesionChat>}
     */
    async create({ clienteId }) {
        const [result] = await pool.query(
            `INSERT INTO sesionchat (ClienteId, IniciadoEn, createdAt, updatedAt, isActive)
         VALUES (?, NOW(), NOW(), NOW(), 1)`,
            [clienteId]
        );
        const insertId = result.insertId;
        return this.findActiveByClienteId(clienteId);
    }

    /**
     * Marca una sesión como finalizada (finalizadoEn = NOW(), isActive = 0).
     * @param {number} sesionId
     * @returns {Promise<void>}
     */
    async end(sesionId) {
        await pool.query(
            `UPDATE sesionchat
         SET FinalizadoEn = NOW(),
             isActive     = 0,
             updatedAt    = NOW()
       WHERE SesionId = ?`,
            [sesionId]
        );
    }
}

module.exports = MysqlSesionChatRepository;
