const ClienteEntity = require('../../core/entities/Cliente');
const mysql         = require('mysql2/promise');
const dbConfig      = require('../../config/dbConfig');
const pool          = mysql.createPool(dbConfig);

class ClienteRepository {
  async findByTelefono(telefono) {
    const [rows] = await pool.query(
      `SELECT
         ClienteId    AS id,
         Nombre       AS nombre,
         Sexo         AS sexo,
         Telefono     AS telefono,
         Email        AS email,
         Direccion    AS direccion,
         TipoCliente  AS tipoCliente,
         createdAt,
         updatedAt,
         isActive
       FROM cliente
       WHERE Telefono = ? AND isActive = 1`,
      [telefono]
    );
    if (!rows.length) return null;
    return new ClienteEntity(rows[0]);
  }

  async create({ nombre, sexo, telefono, email = null, direccion = null, tipoCliente = 'Nuevo' }) {
    const [res] = await pool.query(
      `INSERT INTO cliente
         (Nombre, Sexo, Telefono, Email, Direccion, TipoCliente, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
      [nombre, sexo, telefono, email, direccion, tipoCliente]
    );
    const [rows] = await pool.query(
      `SELECT
         ClienteId    AS id,
         Nombre       AS nombre,
         Sexo         AS sexo,
         Telefono     AS telefono,
         Email        AS email,
         Direccion    AS direccion,
         TipoCliente  AS tipoCliente,
         createdAt,
         updatedAt,
         isActive
       FROM cliente
       WHERE ClienteId = ?`,
      [res.insertId]
    );
    return new ClienteEntity(rows[0]);
  }
}

module.exports = ClienteRepository;
