// src/config/dbConfig.js

/**
 * Parámetros de conexión a la base de datos MySQL.
 * Se usan variables de entorno definidas en .env
 */
module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};