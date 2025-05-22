const SucursalEntity = require('../../core/entities/Sucursal');
const mysql          = require('mysql2/promise');
const dbConfig       = require('../../config/dbConfig');
const pool           = mysql.createPool(dbConfig);

class SucursalRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         SucursalId    AS id,
         Nombre        AS nombre,
         Ciudad        AS ciudad,
         Direccion     AS direccion,
         TipoSucursal  AS tipoSucursal,
         createdAt,
         updatedAt,
         isActive
       FROM sucursal
       WHERE isActive = 1`
    );
    return rows.map(r => new SucursalEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         SucursalId    AS id,
         Nombre        AS nombre,
         Ciudad        AS ciudad,
         Direccion     AS direccion,
         TipoSucursal  AS tipoSucursal,
         createdAt,
         updatedAt,
         isActive
       FROM sucursal
       WHERE SucursalId = ?`,
      [id]
    );
    return rows.length ? new SucursalEntity(rows[0]) : null;
  }

  async create({ nombre, ciudad, direccion, tipoSucursal }) {
    const [res] = await pool.query(
      `INSERT INTO sucursal
         (Nombre, Ciudad, Direccion, TipoSucursal, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, NOW(), NOW(), 1)`,
      [nombre, ciudad, direccion, tipoSucursal]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, ciudad, direccion, tipoSucursal, isActive }) {
    await pool.query(
      `UPDATE sucursal
         SET Nombre = ?, Ciudad = ?, Direccion = ?, TipoSucursal = ?, isActive = ?, updatedAt = NOW()
       WHERE SucursalId = ?`,
      [nombre, ciudad, direccion, tipoSucursal, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE sucursal
         SET isActive = 0, updatedAt = NOW()
       WHERE SucursalId = ?`,
      [id]
    );
  }
}

module.exports = SucursalRepository;
