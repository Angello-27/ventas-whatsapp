// infrastructure/db/MysqlMensajeRepository.js

const IMensajeRepository = require('../../core/repositories/IMensajeRepository');
const Mensaje = require('../../core/entities/Mensaje');
const pool = require('./mysqlPool');

class MysqlMensajeRepository extends IMensajeRepository {
    /**
     * Guarda un mensaje entrante o saliente en la base de datos.
     * @param {{ sesionId: number, direccion: 'Entrante'|'Saliente', contenido: string }} data
     * @returns {Promise<Mensaje>}
     */
    async save({ sesionId, direccion, contenido }) {
        const [result] = await pool.query(
            `INSERT INTO mensajes (SesionId, Direccion, Contenido, createdAt, updatedAt)
         VALUES (?, ?, ?, NOW(), NOW())`,
            [sesionId, direccion, contenido]
        );
        const insertId = result.insertId;

        // Recuperar la fila recién insertada para devolver la entidad
        const [rows] = await pool.query(
            `SELECT MensajeId, SesionId, Direccion, Contenido, createdAt, updatedAt
         FROM mensajes
         WHERE MensajeId = ?`,
            [insertId]
        );
        const r = rows[0];
        return new Mensaje({
            mensajeId: r.MensajeId,
            sesionId: r.SesionId,
            direccion: r.Direccion,
            contenido: r.Contenido,
            timestamp: r.createdAt,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Recupera todos los mensajes de una sesión (ordenados por createdAt asc).
     * @param {number} sesionId
     * @returns {Promise<Mensaje[]>}
     */
    async findBySesionId(sesionId) {
        const [rows] = await pool.query(
            `SELECT MensajeId, SesionId, Direccion, Contenido, createdAt, updatedAt
         FROM mensajes
         WHERE SesionId = ?
         ORDER BY createdAt ASC`,
            [sesionId]
        );
        return rows.map(r => new Mensaje({
            mensajeId: r.MensajeId,
            sesionId: r.SesionId,
            direccion: r.Direccion,
            contenido: r.Contenido,
            timestamp: r.createdAt,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));
    }
}

module.exports = MysqlMensajeRepository;
