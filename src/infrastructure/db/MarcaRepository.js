const MarcaEntity = require('../../core/entities/Marca');
const mysql       = require('mysql2/promise');
const dbConfig    = require('../../config/dbConfig');
const pool        = mysql.createPool(dbConfig);

class MarcaRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         MarcaId      AS id,
         Nombre       AS nombre,
         LogoUrl      AS logoUrl,
         ProveedorId  AS proveedorId,
         createdAt,
         updatedAt,
         isActive
       FROM marca
       WHERE isActive = 1`
    );
    return rows.map(r => new MarcaEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         MarcaId      AS id,
         Nombre       AS nombre,
         LogoUrl      AS logoUrl,
         ProveedorId  AS proveedorId,
         createdAt,
         updatedAt,
         isActive
       FROM marca
       WHERE MarcaId = ?`,
      [id]
    );
    return rows.length ? new MarcaEntity(rows[0]) : null;
  }

  async create({ nombre, logoUrl = null, proveedorId = null }) {
    const [res] = await pool.query(
      `INSERT INTO marca
         (Nombre, LogoUrl, ProveedorId, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [nombre, logoUrl, proveedorId]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, logoUrl, proveedorId, isActive }) {
    await pool.query(
      `UPDATE marca
         SET Nombre = ?, LogoUrl = ?, ProveedorId = ?, isActive = ?, updatedAt = NOW()
       WHERE MarcaId = ?`,
      [nombre, logoUrl, proveedorId, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE marca
         SET isActive = 0, updatedAt = NOW()
       WHERE MarcaId = ?`,
      [id]
    );
  }
}

module.exports = MarcaRepository;