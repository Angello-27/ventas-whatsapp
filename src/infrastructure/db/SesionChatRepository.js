const SesionChatEntity  = require('../../core/entities/SesionChat');
const mysql             = require('mysql2/promise');
const dbConfig          = require('../../config/dbConfig');
const pool              = mysql.createPool(dbConfig);

class SesionChatRepository {
  async findActiveByClienteId(clienteId) {
    const [rows] = await pool.query(
      `SELECT
         SesionId     AS id,
         ClienteId    AS clienteId,
         IniciadoEn   AS iniciadoEn,
         FinalizadoEn AS finalizadoEn,
         createdAt,
         updatedAt,
         isActive
       FROM sesionchat
       WHERE ClienteId = ? 
         AND FinalizadoEn IS NULL 
         AND isActive = 1`,
      [clienteId]
    );
    if (!rows.length) return null;
    return new SesionChatEntity(rows[0]);
  }

  async create({ clienteId }) {
    const [res] = await pool.query(
      `INSERT INTO sesionchat
         (ClienteId, IniciadoEn, createdAt, updatedAt, isActive)
       VALUES (?, NOW(), NOW(), NOW(), 1)`,
      [clienteId]
    );
    return this.findActiveByClienteId(clienteId);
  }

  async end(id) {
    await pool.query(
      `UPDATE sesionchat
         SET FinalizadoEn = NOW(), updatedAt = NOW()
       WHERE SesionId = ?`,
      [id]
    );
  }
}

module.exports = SesionChatRepository;
