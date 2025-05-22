const Customer = require('../../core/entities/Customer');
const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class MySQLCustomerRepository {
  async findByPhoneNumber(phoneNumber) {
    const [rows] = await pool.query(
      'SELECT id, name, phoneNumber, type, registeredAt FROM Customer WHERE phoneNumber = ?',
      [phoneNumber]
    );
    if (rows.length === 0) return null;
    return new Customer(rows[0]);
  }

  async create({ name, phoneNumber, type = 'NEW' }) {
    const [result] = await pool.query(
      'INSERT INTO Customer (name, phoneNumber, type, registeredAt) VALUES (?, ?, ?, NOW())',
      [name, phoneNumber, type]
    );
    const [rows] = await pool.query(
      'SELECT id, name, phoneNumber, type, registeredAt FROM Customer WHERE id = ?',
      [result.insertId]
    );
    return new Customer(rows[0]);
  }
}

module.exports = MySQLCustomerRepository;