const ChatSession = require('../../core/entities/ChatSession');
const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class MySQLSessionRepository {
  async findActiveByCustomerId(customerId) {
    const [rows] = await pool.query(
      'SELECT id, customerId, startedAt, endedAt FROM ChatSession WHERE customerId = ? AND endedAt IS NULL',
      [customerId]
    );
    if (rows.length === 0) return null;
    return new ChatSession(rows[0]);
  }

  async create({ customerId }) {
    const [result] = await pool.query(
      'INSERT INTO ChatSession (customerId, startedAt) VALUES (?, NOW())',
      [customerId]
    );
    const [rows] = await pool.query(
      'SELECT id, customerId, startedAt, endedAt FROM ChatSession WHERE id = ?',
      [result.insertId]
    );
    return new ChatSession(rows[0]);
  }

  async end(sessionId) {
    await pool.query(
      'UPDATE ChatSession SET endedAt = NOW() WHERE id = ?',
      [sessionId]
    );
  }
}

module.exports = MySQLSessionRepository;