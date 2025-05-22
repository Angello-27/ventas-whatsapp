const OrdenEntity = require('../../core/entities/Orden');
const mysql       = require('mysql2/promise');
const dbConfig    = require('../../config/dbConfig');
const pool        = mysql.createPool(dbConfig);

class OrdenRepository {
  async findAllActive() {
    const [rows] = await pool.query(
      `SELECT
         OrdenId    AS id,
         ClienteId  AS clienteId,
         createdAt,
         updatedAt,
         isActive
       FROM orden
       WHERE isActive = 1`
    );
    return rows.map(r => new OrdenEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         OrdenId    AS id,
         ClienteId  AS clienteId,
         createdAt,
         updatedAt,
         isActive
       FROM orden
       WHERE OrdenId = ?`,
      [id]
    );
    return rows.length ? new OrdenEntity(rows[0]) : null;
  }

  async create({ clienteId }) {
    const [res] = await pool.query(
      `INSERT INTO orden
         (ClienteId, createdAt, updatedAt, isActive)
       VALUES (?, NOW(), NOW(), 1)`,
      [clienteId]
    );
    return this.findById(res.insertId);
  }

  async update(id, { clienteId, isActive }) {
    await pool.query(
      `UPDATE orden
         SET ClienteId = ?, isActive = ?, updatedAt = NOW()
       WHERE OrdenId = ?`,
      [clienteId, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE orden
         SET isActive = 0, updatedAt = NOW()
       WHERE OrdenId = ?`,
      [id]
    );
  }
}

module.exports = OrdenRepository;