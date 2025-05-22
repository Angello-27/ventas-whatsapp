const ClienteEntity = require('../../core/entities/Customer');
const mysql    = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool     = mysql.createPool(dbConfig);

class ClienteRepository {
  async findByPhoneNumber(phoneNumber) {
    const [rows] = await pool.query(
      `SELECT 
         ClienteId    AS id,
         Nombre       AS name,
         Telefono     AS phoneNumber,
         Email        AS email,
         Direccion    AS address,
         TipoCliente  AS type,
         createdAt    AS registeredAt
       FROM cliente
       WHERE Telefono = ? AND isActive = 1`,
      [phoneNumber]
    );
    if (rows.length === 0) return null;
    return new ClienteEntity(rows[0]);
  }

  async create({ name, phoneNumber, email = null, address = null, type = 'Nuevo' }) {
    const [result] = await pool.query(
      `INSERT INTO cliente 
         (Nombre, Telefono, Email, Direccion, TipoCliente, createdAt, updatedAt, isActive)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
      [name, phoneNumber, email, address, type]
    );
    const [rows] = await pool.query(
      `SELECT 
         ClienteId    AS id,
         Nombre       AS name,
         Telefono     AS phoneNumber,
         Email        AS email,
         Direccion    AS address,
         TipoCliente  AS type,
         createdAt    AS registeredAt
       FROM cliente
       WHERE ClienteId = ?`,
      [result.insertId]
    );
    return new ClienteEntity(rows[0]);
  }
}

module.exports = ClienteRepository;
