const CampanaAmbitoEntity = require('../../core/entities/CampanaAmbito');
const mysql                = require('mysql2/promise');
const dbConfig             = require('../../config/dbConfig');
const pool                 = mysql.createPool(dbConfig);

class CampanaAmbitoRepository {
  async findByCampanaId(campanaId) {
    const [rows] = await pool.query(
      `SELECT
         AlcanceId    AS id,
         CampanaId,
         TipoAmbito   AS tipoAmbito,
         ObjetoId     AS objetoId,
         createdAt,
         updatedAt,
         isActive
       FROM campanaambito
       WHERE CampanaId = ? AND isActive = 1`,
      [campanaId]
    );
    return rows.map(r => new CampanaAmbitoEntity(r));
  }

  async create({ campanaId, tipoAmbito, objetoId }) {
    const [res] = await pool.query(
      `INSERT INTO campanaambito 
         (CampanaId, TipoAmbito, ObjetoId, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [campanaId, tipoAmbito, objetoId]
    );
    const [rows] = await pool.query(
      `SELECT 
         AlcanceId    AS id,
         CampanaId,
         TipoAmbito   AS tipoAmbito,
         ObjetoId     AS objetoId,
         createdAt,
         updatedAt,
         isActive
       FROM campanaambito
       WHERE AlcanceId = ?`,
      [res.insertId]
    );
    return new CampanaAmbitoEntity(rows[0]);
  }

  async deleteByCampanaId(campanaId) {
    await pool.query(
      `UPDATE campanaambito
         SET isActive = 0, updatedAt = NOW()
       WHERE CampanaId = ?`,
      [campanaId]
    );
  }
}

module.exports = CampanaAmbitoRepository;
