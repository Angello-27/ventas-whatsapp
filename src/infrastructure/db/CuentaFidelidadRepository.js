const CuentaFidelidadEntity = require('../../core/entities/CuentaFidelidad');
const mysql                  = require('mysql2/promise');
const dbConfig               = require('../../config/dbConfig');
const pool                   = mysql.createPool(dbConfig);

class CuentaFidelidadRepository {
  async findByClienteId(clienteId) {
    const [rows] = await pool.query(
      `SELECT
         CuentaId      AS id,
         ClienteId,
         PuntosBalance AS puntosBalance,
         Nivel         AS nivel,
         createdAt,
         updatedAt,
         isActive
       FROM cuentafidelidad
       WHERE ClienteId = ? AND isActive = 1`,
      [clienteId]
    );
    return rows.length ? new CuentaFidelidadEntity(rows[0]) : null;
  }

  async create({ clienteId, puntosBalance = 0, nivel = null }) {
    const [res] = await pool.query(
      `INSERT INTO cuentafidelidad
         (ClienteId, PuntosBalance, Nivel, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [clienteId, puntosBalance, nivel]
    );
    return this.findByClienteId(clienteId);
  }

  async updatePoints(clienteId, puntosBalance) {
    await pool.query(
      `UPDATE cuentafidelidad
         SET PuntosBalance = ?, updatedAt = NOW()
       WHERE ClienteId = ?`,
      [puntosBalance, clienteId]
    );
    return this.findByClienteId(clienteId);
  }

  async deleteByClienteId(clienteId) {
    await pool.query(
      `UPDATE cuentafidelidad
         SET isActive = 0, updatedAt = NOW()
       WHERE ClienteId = ?`,
      [clienteId]
    );
  }
}

module.exports = CuentaFidelidadRepository;
