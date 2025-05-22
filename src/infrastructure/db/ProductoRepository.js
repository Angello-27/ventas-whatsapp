const ProductoEntity = require('../../core/entities/Producto');
const mysql           = require('mysql2/promise');
const dbConfig        = require('../../config/dbConfig');
const pool            = mysql.createPool(dbConfig);

class ProductoRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         ProductoId   AS id,
         Nombre       AS nombre,
         MarcaId      AS marcaId,
         CategoriaId  AS categoriaId,
         createdAt,
         updatedAt,
         isActive
       FROM producto
       WHERE isActive = 1`
    );
    return rows.map(r => new ProductoEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         ProductoId   AS id,
         Nombre       AS nombre,
         MarcaId      AS marcaId,
         CategoriaId  AS categoriaId,
         createdAt,
         updatedAt,
         isActive
       FROM producto
       WHERE ProductoId = ?`,
      [id]
    );
    return rows.length ? new ProductoEntity(rows[0]) : null;
  }

  async create({ nombre, marcaId = null, categoriaId = null }) {
    const [res] = await pool.query(
      `INSERT INTO producto
         (Nombre, MarcaId, CategoriaId, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [nombre, marcaId, categoriaId]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, marcaId, categoriaId, isActive }) {
    await pool.query(
      `UPDATE producto
         SET Nombre = ?, MarcaId = ?, CategoriaId = ?, isActive = ?, updatedAt = NOW()
       WHERE ProductoId = ?`,
      [nombre, marcaId, categoriaId, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE producto
         SET isActive = 0, updatedAt = NOW()
       WHERE ProductoId = ?`,
      [id]
    );
  }
}

module.exports = ProductoRepository;
