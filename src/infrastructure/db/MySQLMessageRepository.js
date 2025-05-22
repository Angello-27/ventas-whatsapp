const MessageEntity = require('../../core/entities/Message');
const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class MySQLMessageRepository {
  async save({ sessionId, direction, content }) {
    const [result] = await pool.query(
      'INSERT INTO Message (sessionId, timestamp, direction, content) VALUES (?, NOW(), ?, ?)',
      [sessionId, direction, content]
    );
    const [rows] = await pool.query(
      'SELECT id, sessionId, timestamp, direction, content FROM Message WHERE id = ?',
      [result.insertId]
    );
    return new MessageEntity(rows[0]);
  }

  async findBySessionId(sessionId) {
    const [rows] = await pool.query(
      'SELECT id, sessionId, timestamp, direction, content FROM Message WHERE sessionId = ? ORDER BY timestamp',
      [sessionId]
    );
    return rows.map(row => new MessageEntity(row));
  }
}

module.exports = MySQLMessageRepository;