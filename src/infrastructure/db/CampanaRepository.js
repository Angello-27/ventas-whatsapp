const CampanaEntity = require('../../core/entities/Campana');
const mysql         = require('mysql2/promise');
const dbConfig      = require('../../config/dbConfig');
const pool          = mysql.createPool(dbConfig);

class CampanaRepository {
  async findActive() {
    const [rows] = await pool.query(
      `SELECT 
         CampanaId    AS id,
         Nombre       AS nombre,
         \`Descripción\` AS descripcion,
         Tipo         AS tipo,
         FechaInicio  AS fechaInicio,
         FechaFin     AS fechaFin,
         Parámetros   AS parametros,
         createdAt,
         updatedAt,
         isActive
       FROM campana
       WHERE isActive = 1`
    );
    return rows.map(r => new CampanaEntity(r));
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
         CampanaId    AS id,
         Nombre       AS nombre,
         \`Descripción\` AS descripcion,
         Tipo         AS tipo,
         FechaInicio  AS fechaInicio,
         FechaFin     AS fechaFin,
         Parámetros   AS parametros,
         createdAt,
         updatedAt,
         isActive
       FROM campana
       WHERE CampanaId = ?`,
      [id]
    );
    return rows.length ? new CampanaEntity(rows[0]) : null;
  }

  async create({ nombre, descripcion, tipo, fechaInicio, fechaFin, parametros }) {
    const [res] = await pool.query(
      `INSERT INTO campana 
         (Nombre, \`Descripción\`, Tipo, FechaInicio, FechaFin, Parámetros, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
      [nombre, descripcion, tipo, fechaInicio, fechaFin, JSON.stringify(parametros)]
    );
    return this.findById(res.insertId);
  }

  async update(id, { nombre, descripcion, tipo, fechaInicio, fechaFin, parametros, isActive }) {
    await pool.query(
      `UPDATE campana
         SET Nombre = ?, \`Descripción\` = ?, Tipo = ?, FechaInicio = ?, FechaFin = ?, Parámetros = ?, isActive = ?, updatedAt = NOW()
       WHERE CampanaId = ?`,
      [nombre, descripcion, tipo, fechaInicio, fechaFin, JSON.stringify(parametros), isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(
      `UPDATE campana
         SET isActive = 0, updatedAt = NOW()
       WHERE CampanaId = ?`,
      [id]
    );
  }
}

module.exports = CampanaRepository;
