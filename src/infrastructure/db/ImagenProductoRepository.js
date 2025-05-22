const ImagenProductoEntity = require('../../core/entities/ImagenProducto');
const mysql                = require('mysql2/promise');
const dbConfig             = require('../../config/dbConfig');
const pool                 = mysql.createPool(dbConfig);

class ImagenProductoRepository {
  async findByProductoId(productoId) {
    const [rows] = await pool.query(
      `SELECT
         ImagenId    AS id,
         ProductoId  AS productoId,
         Url         AS url,
         createdAt,
         updatedAt,
         isActive
       FROM imagenproducto
       WHERE ProductoId = ? AND isActive = 1`,
      [productoId]
    );
    return rows.map(r => new ImagenProductoEntity(r));
  }

  async create({ productoId, url }) {
    const [res] = await pool.query(
      `INSERT INTO imagenproducto
         (ProductoId, Url, createdAt, updatedAt, isActive)
       VALUES (?, ?, NOW(), NOW(), 1)`,
      [productoId, url]
    );
    const [rows] = await pool.query(
      `SELECT
         ImagenId    AS id,
         ProductoId  AS productoId,
         Url         AS url,
         createdAt,
         updatedAt,
         isActive
       FROM imagenproducto
       WHERE ImagenId = ?`,
      [res.insertId]
    );
    return new ImagenProductoEntity(rows[0]);
  }

  async deleteByProductoId(productoId) {
    await pool.query(
      `UPDATE imagenproducto
         SET isActive = 0, updatedAt = NOW()
       WHERE ProductoId = ?`,
      [productoId]
    );
  }
}

module.exports = ImagenProductoRepository;
