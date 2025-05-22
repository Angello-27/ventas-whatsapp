const ReferidoEntity = require('../../core/entities/Referido');
const mysql          = require('mysql2/promise');
const dbConfig       = require('../../config/dbConfig');
const pool           = mysql.createPool(dbConfig);

class ReferidoRepository {
  async findByReferidorId(referidorId) {
    const [rows] = await pool.query(
      `SELECT
         ReferidoId    AS id,
         ReferidorId   AS referidorId,
         ReferidoPorId AS referidoPorId,
         createdAt,
         updatedAt,
         isActive
       FROM referido
       WHERE ReferidorId = ? AND isActive = 1`,
      [referidorId]
    );
    return rows.map(r => new ReferidoEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         ReferidoId    AS id,
         ReferidorId   AS referidorId,
         ReferidoPorId AS referidoPorId,
         createdAt,
         updatedAt,
         isActive
       FROM referido
       WHERE ReferidoId = ?`,
      [id]
    );
    return rows.length ? new ReferidoEntity(rows[0]) : null;
  }

  async create({ referidorId, referidoPorId }) {
    const [res] = await pool.query(
      `INSERT INTO referido
         (ReferidorId, ReferidoPorId, createdAt, updatedAt, isActive)
       VALUES (?, ?, NOW(), NOW(), 1)`,
      [referidorId, referidoPorId]
    );
    return this.findById(res.insertId);
  }

  async update(id, { referidorId, referidoPorId, isActive }) {
    await pool.query(
      `UPDATE referido
         SET ReferidorId = ?, ReferidoPorId = ?, isActive = ?, updatedAt = NOW()
       WHERE ReferidoId = ?`,
      [referidorId, referidoPorId, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE referido
         SET isActive = 0, updatedAt = NOW()
       WHERE ReferidoId = ?`,
      [id]
    );
  }
}

module.exports = ReferidoRepository;
