const PrecioEntity = require('../../core/entities/Precio');
const mysql        = require('mysql2/promise');
const dbConfig     = require('../../config/dbConfig');
const pool         = mysql.createPool(dbConfig);

class PrecioRepository {
  async findActiveByEnvase(envaseId) {
    const [rows] = await pool.query(
      `SELECT
         PrecioId       AS id,
         EnvaseId       AS envaseId,
         TipoPrecio     AS tipoPrecio,
         UmbralCantidad AS umbralCantidad,
         Monto          AS monto,
         VigenteDesde   AS vigenteDesde,
         VigenteHasta   AS vigenteHasta,
         createdAt,
         updatedAt,
         isActive
       FROM precio
       WHERE EnvaseId = ? AND isActive = 1
         AND (VigenteHasta IS NULL OR VigenteHasta >= NOW())
         AND (VigenteDesde IS NULL OR VigenteDesde <= NOW())`,
      [envaseId]
    );
    return rows.map(r => new PrecioEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         PrecioId       AS id,
         EnvaseId       AS envaseId,
         TipoPrecio     AS tipoPrecio,
         UmbralCantidad AS umbralCantidad,
         Monto          AS monto,
         VigenteDesde   AS vigenteDesde,
         VigenteHasta   AS vigenteHasta,
         createdAt,
         updatedAt,
         isActive
       FROM precio
       WHERE PrecioId = ?`,
      [id]
    );
    return rows.length ? new PrecioEntity(rows[0]) : null;
  }

  async create({ envaseId, tipoPrecio, umbralCantidad = null, monto, vigenteDesde = null, vigenteHasta = null }) {
    const [res] = await pool.query(
      `INSERT INTO precio
         (EnvaseId, TipoPrecio, UmbralCantidad, Monto, VigenteDesde, VigenteHasta, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
      [envaseId, tipoPrecio, umbralCantidad, monto, vigenteDesde, vigenteHasta]
    );
    return this.findById(res.insertId);
  }

  async update(id, { tipoPrecio, umbralCantidad, monto, vigenteDesde, vigenteHasta, isActive }) {
    await pool.query(
      `UPDATE precio
         SET TipoPrecio = ?, UmbralCantidad = ?, Monto = ?, VigenteDesde = ?, VigenteHasta = ?, isActive = ?, updatedAt = NOW()
       WHERE PrecioId = ?`,
      [tipoPrecio, umbralCantidad, monto, vigenteDesde, vigenteHasta, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE precio
         SET isActive = 0, updatedAt = NOW()
       WHERE PrecioId = ?`,
      [id]
    );
  }
}

module.exports = PrecioRepository;
