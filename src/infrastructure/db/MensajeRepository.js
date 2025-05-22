const MensajeEntity = require('../../core/entities/Mensaje');
const mysql         = require('mysql2/promise');
const dbConfig      = require('../../config/dbConfig');
const pool          = mysql.createPool(dbConfig);

class MensajeRepository {
  async save({ sesionId, direccion, contenido }) {
    const [res] = await pool.query(
      `INSERT INTO mensaje
         (SesionId, FechaEnvio, Direccion, Contenido, createdAt, updatedAt, isActive)
       VALUES (?, NOW(), ?, ?, NOW(), NOW(), 1)`,
      [sesionId, direccion, contenido]
    );
    return this.findById(res.insertId);
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         MensajeId    AS id,
         SesionId     AS sesionId,
         FechaEnvio   AS fechaEnvio,
         Direccion    AS direccion,
         Contenido    AS contenido,
         createdAt,
         updatedAt,
         isActive
       FROM mensaje
       WHERE MensajeId = ?`,
      [id]
    );
    return rows.length ? new MensajeEntity(rows[0]) : null;
  }

  async findBySesionId(sesionId) {
    const [rows] = await pool.query(
      `SELECT
         MensajeId    AS id,
         SesionId     AS sesionId,
         FechaEnvio   AS fechaEnvio,
         Direccion    AS direccion,
         Contenido    AS contenido,
         createdAt,
         updatedAt,
         isActive
       FROM mensaje
       WHERE SesionId = ? AND isActive = 1
       ORDER BY FechaEnvio`,
      [sesionId]
    );
    return rows.map(r => new MensajeEntity(r));
  }
}

module.exports = MensajeRepository;
