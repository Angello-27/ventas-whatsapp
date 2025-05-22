const CampanaItemEntity = require('../../core/entities/CampanaItem');
const mysql             = require('mysql2/promise');
const dbConfig          = require('../../config/dbConfig');
const pool              = mysql.createPool(dbConfig);

class CampanaItemRepository {
  async findByCampanaId(campanaId) {
    const [rows] = await pool.query(
      `SELECT
         ItemId       AS id,
         CampanaId,
         EnvaseId,
         Cantidad,
         createdAt,
         updatedAt,
         isActive
       FROM campanaitem
       WHERE CampanaId = ? AND isActive = 1`,
      [campanaId]
    );
    return rows.map(r => new CampanaItemEntity(r));
  }

  async create({ campanaId, envaseId, cantidad = 1 }) {
    const [res] = await pool.query(
      `INSERT INTO campanaitem
         (CampanaId, EnvaseId, Cantidad, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [campanaId, envaseId, cantidad]
    );
    const [rows] = await pool.query(
      `SELECT
         ItemId       AS id,
         CampanaId,
         EnvaseId,
         Cantidad,
         createdAt,
         updatedAt,
         isActive
       FROM campanaitem
       WHERE ItemId = ?`,
      [res.insertId]
    );
    return new CampanaItemEntity(rows[0]);
  }

  async deleteByCampanaId(campanaId) {
    await pool.query(
      `UPDATE campanaitem
         SET isActive = 0, updatedAt = NOW()
       WHERE CampanaId = ?`,
      [campanaId]
    );
  }
}

module.exports = CampanaItemRepository;
