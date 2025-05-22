const CategoriaEntity = require('../../core/entities/Categoria');
const mysql           = require('mysql2/promise');
const dbConfig        = require('../../config/dbConfig');
const pool            = mysql.createPool(dbConfig);

class CategoriaRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         CategoriaId    AS id,
         Nombre         AS nombre,
         PadreCategoriaId AS padreCategoriaId,
         createdAt,
         updatedAt,
         isActive
       FROM categoria
       WHERE isActive = 1`
    );
    return rows.map(r => new CategoriaEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         CategoriaId    AS id,
         Nombre         AS nombre,
         PadreCategoriaId AS padreCategoriaId,
         createdAt,
         updatedAt,
         isActive
       FROM categoria
       WHERE CategoriaId = ?`,
      [id]
    );
    return rows.length ? new CategoriaEntity(rows[0]) : null;
  }

  async create({ nombre, padreCategoriaId = null }) {
    const [res] = await pool.query(
      `INSERT INTO categoria
         (Nombre, PadreCategoriaId, createdAt, updatedAt, isActive)
       VALUES (?, ?, NOW(), NOW(), 1)`,
      [nombre, padreCategoriaId]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, padreCategoriaId, isActive }) {
    await pool.query(
      `UPDATE categoria
         SET Nombre = ?, PadreCategoriaId = ?, isActive = ?, updatedAt = NOW()
       WHERE CategoriaId = ?`,
      [nombre, padreCategoriaId, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE categoria
         SET isActive = 0, updatedAt = NOW()
       WHERE CategoriaId = ?`,
      [id]
    );
  }
}

module.exports = CategoriaRepository;
