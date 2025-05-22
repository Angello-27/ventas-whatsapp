const InventarioEntity = require('../../core/entities/Inventario');
const mysql            = require('mysql2/promise');
const dbConfig         = require('../../config/dbConfig');
const pool             = mysql.createPool(dbConfig);

class InventarioRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         InventarioId AS id,
         EnvaseId     AS envaseId,
         AlmacenId    AS almacenId,
         Cantidad     AS cantidad,
         createdAt,
         updatedAt,
         isActive
       FROM inventario
       WHERE isActive = 1`
    );
    return rows.map(r => new InventarioEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         InventarioId AS id,
         EnvaseId     AS envaseId,
         AlmacenId    AS almacenId,
         Cantidad     AS cantidad,
         createdAt,
         updatedAt,
         isActive
       FROM inventario
       WHERE InventarioId = ?`,
      [id]
    );
    return rows.length ? new InventarioEntity(rows[0]) : null;
  }

  async findByEnvaseId(envaseId) {
    const [rows] = await pool.query(
      `SELECT
         InventarioId AS id,
         EnvaseId     AS envaseId,
         AlmacenId    AS almacenId,
         Cantidad     AS cantidad,
         createdAt,
         updatedAt,
         isActive
       FROM inventario
       WHERE EnvaseId = ? AND isActive = 1`,
      [envaseId]
    );
    return rows.map(r => new InventarioEntity(r));
  }

  async create({ envaseId, almacenId, cantidad }) {
    const [res] = await pool.query(
      `INSERT INTO inventario
         (EnvaseId, AlmacenId, Cantidad, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [envaseId, almacenId, cantidad]
    );
    return this.findById(res.insertId);
  }

  async update(id, { cantidad, isActive }) {
    await pool.query(
      `UPDATE inventario
         SET Cantidad = ?, isActive = ?, updatedAt = NOW()
       WHERE InventarioId = ?`,
      [cantidad, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE inventario
         SET isActive = 0, updatedAt = NOW()
       WHERE InventarioId = ?`,
      [id]
    );
  }
}

module.exports = InventarioRepository;
