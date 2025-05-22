const MensajeEntity = require('../../core/entities/Message');
const mysql         = require('mysql2/promise');
const dbConfig      = require('../../config/dbConfig');
const pool          = mysql.createPool(dbConfig);

class MensajeRepository {
  async save({ sessionId, direction, content }) {
    const [result] = await pool.query(
      `INSERT INTO mensaje 
         (SesionId, FechaEnvio, Direccion, Contenido, createdAt, updatedAt, isActive)
       VALUES (?, NOW(), ?, ?, NOW(), NOW(), 1)`,
      [sessionId, direction, content]
    );
    const [rows] = await pool.query(
      `SELECT 
         MensajeId  AS id,
         SesionId   AS sessionId,
         FechaEnvio AS timestamp,
         Direccion  AS direction,
         Contenido  AS content
       FROM mensaje
       WHERE MensajeId = ?`,
      [result.insertId]
    );
    return new MensajeEntity(rows[0]);
  }

  async findBySessionId(sessionId) {
    const [rows] = await pool.query(
      `SELECT 
         MensajeId  AS id,
         SesionId   AS sessionId,
         FechaEnvio AS timestamp,
         Direccion  AS direction,
         Contenido  AS content
       FROM mensaje
       WHERE SesionId = ? AND isActive = 1
       ORDER BY FechaEnvio`,
      [sessionId]
    );
    return rows.map(row => new MensajeEntity(row));
  }
}

module.exports = MensajeRepository;
