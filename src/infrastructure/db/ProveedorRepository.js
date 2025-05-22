const ProveedorEntity = require('../../core/entities/Proveedor');
const mysql           = require('mysql2/promise');
const dbConfig        = require('../../config/dbConfig');
const pool            = mysql.createPool(dbConfig);

class ProveedorRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         ProveedorId AS id,
         Nombre      AS nombre,
         Contacto    AS contacto,
         createdAt,
         updatedAt,
         isActive
       FROM proveedor
       WHERE isActive = 1`
    );
    return rows.map(r => new ProveedorEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         ProveedorId AS id,
         Nombre      AS nombre,
         Contacto    AS contacto,
         createdAt,
         updatedAt,
         isActive
       FROM proveedor
       WHERE ProveedorId = ?`,
      [id]
    );
    return rows.length ? new ProveedorEntity(rows[0]) : null;
  }

  async create({ nombre, contacto = null }) {
    const [res] = await pool.query(
      `INSERT INTO proveedor
         (Nombre, Contacto, createdAt, updatedAt, isActive)
       VALUES (?, ?, NOW(), NOW(), 1)`,
      [nombre, contacto]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, contacto, isActive }) {
    await pool.query(
      `UPDATE proveedor
         SET Nombre = ?, Contacto = ?, isActive = ?, updatedAt = NOW()
       WHERE ProveedorId = ?`,
      [nombre, contacto, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE proveedor
         SET isActive = 0, updatedAt = NOW()
       WHERE ProveedorId = ?`,
      [id]
    );
  }
}

module.exports = ProveedorRepository;
