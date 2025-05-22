const ItemOrdenEntity = require('../../core/entities/ItemOrden');
const mysql           = require('mysql2/promise');
const dbConfig        = require('../../config/dbConfig');
const pool            = mysql.createPool(dbConfig);

class ItemOrdenRepository {
  async findByOrdenId(ordenId) {
    const [rows] = await pool.query(
      `SELECT
         ItemOrdenId     AS id,
         OrdenId         AS ordenId,
         EnvaseId        AS envaseId,
         Cantidad        AS cantidad,
         PrecioUnitario  AS precioUnitario,
         createdAt,
         updatedAt,
         isActive
       FROM itemorden
       WHERE OrdenId = ? AND isActive = 1`,
      [ordenId]
    );
    return rows.map(r => new ItemOrdenEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         ItemOrdenId     AS id,
         OrdenId         AS ordenId,
         EnvaseId        AS envaseId,
         Cantidad        AS cantidad,
         PrecioUnitario  AS precioUnitario,
         createdAt,
         updatedAt,
         isActive
       FROM itemorden
       WHERE ItemOrdenId = ?`,
      [id]
    );
    return rows.length ? new ItemOrdenEntity(rows[0]) : null;
  }

  async create({ ordenId, envaseId, cantidad = 1, precioUnitario = 0.0 }) {
    const [res] = await pool.query(
      `INSERT INTO itemorden
         (OrdenId, EnvaseId, Cantidad, PrecioUnitario, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, NOW(), NOW(), 1)`,
      [ordenId, envaseId, cantidad, precioUnitario]
    );
    return this.findById(res.insertId);
  }

  async update(id, { cantidad, precioUnitario, isActive }) {
    await pool.query(
      `UPDATE itemorden
         SET Cantidad = ?, PrecioUnitario = ?, isActive = ?, updatedAt = NOW()
       WHERE ItemOrdenId = ?`,
      [cantidad, precioUnitario, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE itemorden
         SET isActive = 0, updatedAt = NOW()
       WHERE ItemOrdenId = ?`,
      [id]
    );
  }
}

module.exports = ItemOrdenRepository;