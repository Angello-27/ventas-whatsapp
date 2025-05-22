const SesionChatEntity = require('../../core/entities/ChatSession');
const mysql       = require('mysql2/promise');
const dbConfig    = require('../../config/dbConfig');
const pool        = mysql.createPool(dbConfig);

class SesionChatRepository {
  async findActiveByCustomerId(customerId) {
    const [rows] = await pool.query(
      `SELECT 
         SesionId      AS id,
         ClienteId     AS customerId,
         IniciadoEn    AS startedAt,
         FinalizadoEn  AS endedAt
       FROM sesionchat
       WHERE ClienteId = ? 
         AND FinalizadoEn IS NULL 
         AND isActive = 1`,
      [customerId]
    );
    if (rows.length === 0) return null;
    return new SesionChatEntity(rows[0]);
  }

  async create({ customerId }) {
    const [result] = await pool.query(
      `INSERT INTO sesionchat 
         (ClienteId, IniciadoEn, createdAt, updatedAt, isActive)
       VALUES (?, NOW(), NOW(), NOW(), 1)`,
      [customerId]
    );
    const [rows] = await pool.query(
      `SELECT 
         SesionId      AS id,
         ClienteId     AS customerId,
         IniciadoEn    AS startedAt,
         FinalizadoEn  AS endedAt
       FROM sesionchat
       WHERE SesionId = ?`,
      [result.insertId]
    );
    return new SesionChatEntity(rows[0]);
  }

  async end(sessionId) {
    await pool.query(
      `UPDATE sesionchat 
         SET FinalizadoEn = NOW(), updatedAt = NOW() 
       WHERE SesionId = ?`,
      [sessionId]
    );
  }
}

module.exports = SesionChatRepository;
