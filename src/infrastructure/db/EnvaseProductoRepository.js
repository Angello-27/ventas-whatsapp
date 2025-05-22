const EnvaseProductoEntity = require('../../core/entities/EnvaseProducto');
const mysql                = require('mysql2/promise');
const dbConfig             = require('../../config/dbConfig');
const pool                 = mysql.createPool(dbConfig);

class EnvaseProductoRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         EnvaseId   AS id,
         SKU        AS sku,
         Descripcion AS descripcion,
         ProductoId AS productoId,
         Atributos  AS atributos,
         createdAt,
         updatedAt,
         isActive
       FROM envaseproducto
       WHERE isActive = 1`
    );
    return rows.map(r => new EnvaseProductoEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         EnvaseId   AS id,
         SKU        AS sku,
         Descripcion AS descripcion,
         ProductoId AS productoId,
         Atributos  AS atributos,
         createdAt,
         updatedAt,
         isActive
       FROM envaseproducto
       WHERE EnvaseId = ? AND isActive = 1`,
      [id]
    );
    return rows.length ? new EnvaseProductoEntity(rows[0]) : null;
  }

  async findByProductoId(productoId) {
    const [rows] = await pool.query(
      `SELECT
         EnvaseId   AS id,
         SKU        AS sku,
         Descripcion AS descripcion,
         ProductoId AS productoId,
         Atributos  AS atributos,
         createdAt,
         updatedAt,
         isActive
       FROM envaseproducto
       WHERE ProductoId = ? AND isActive = 1`,
      [productoId]
    );
    return rows.map(r => new EnvaseProductoEntity(r));
  }

  async create({ sku, descripcion, productoId, atributos }) {
    const [res] = await pool.query(
      `INSERT INTO envaseproducto
         (SKU, Descripcion, ProductoId, Atributos, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, NOW(), NOW(), 1)`,
      [sku, descripcion, productoId, JSON.stringify(atributos)]
    );
    return this.findById(res.insertId);
  }

  async update(id, { sku, descripcion, productoId, atributos, isActive }) {
    await pool.query(
      `UPDATE envaseproducto
         SET SKU = ?, Descripcion = ?, ProductoId = ?, Atributos = ?, isActive = ?, updatedAt = NOW()
       WHERE EnvaseId = ?`,
      [sku, descripcion, productoId, JSON.stringify(atributos), isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE envaseproducto
         SET isActive = 0, updatedAt = NOW()
       WHERE EnvaseId = ?`,
      [id]
    );
  }
}

module.exports = EnvaseProductoRepository;
