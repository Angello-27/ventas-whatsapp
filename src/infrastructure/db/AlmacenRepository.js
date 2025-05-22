const AlmacenEntity = require('../../core/entities/Almacen');
const mysql         = require('mysql2/promise');
const dbConfig      = require('../../config/dbConfig');
const pool          = mysql.createPool(dbConfig);

class AlmacenRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT 
         AlmacenId   AS id,
         Nombre      AS nombre,
         Direccion   AS direccion,
         SucursalId  AS sucursalId,
         createdAt,
         updatedAt,
         isActive
       FROM almacen
       WHERE isActive = 1`
    );
    return rows.map(r => new AlmacenEntity(r));
  }
  
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
         AlmacenId   AS id,
         Nombre      AS nombre,
         Direccion   AS direccion,
         SucursalId  AS sucursalId,
         createdAt,
         updatedAt,
         isActive
       FROM almacen
       WHERE AlmacenId = ? AND isActive = 1`,
      [id]
    );
    if (!rows.length) return null;
    return new AlmacenEntity(rows[0]);
  }

  async create({ nombre, direccion, sucursalId }) {
    const [res] = await pool.query(
      `INSERT INTO almacen (Nombre, Direccion, SucursalId, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, NOW(), NOW(), 1)`,
      [nombre, direccion, sucursalId]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, direccion, sucursalId, isActive }) {
    await pool.query(
      `UPDATE almacen
         SET Nombre = ?, Direccion = ?, SucursalId = ?, isActive = ?, updatedAt = NOW()
       WHERE AlmacenId = ?`,
      [nombre, direccion, sucursalId, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE almacen
         SET isActive = 0, updatedAt = NOW()
       WHERE AlmacenId = ?`,
      [id]
    );
  }
}

module.exports = AlmacenRepository;
