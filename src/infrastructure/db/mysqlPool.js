// infrastructure/db/mysqlPool.js

const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');

// Creamos un único pool y lo exportamos.
// Node lo cacheará, así que solo habrá una instancia durante toda la app.
const pool = mysql.createPool(dbConfig);

module.exports = pool;
