// infrastructure/db/MysqlInteresesRepository.js

const IInteresesRepository = require('../../core/repositories/IInteresesRepository');
const Intereses = require('../../core/entities/Intereses');
const pool = require('./mysqlPool');

class MysqlInteresesRepository extends IInteresesRepository {
    /**
     * Busca los intereses de un cliente dado su ID.
     * @param {number} clienteId
     * @returns {Promise<Intereses|null>}
     */
    async findByClienteId(clienteId) {
        const [rows] = await pool.query(
            `SELECT InteresId, ClienteId, Intereses, createdAt, updatedAt
         FROM intereses
         WHERE ClienteId = ?
         LIMIT 1`,
            [clienteId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Intereses({
            interesId: r.InteresId,
            clienteId: r.ClienteId,
            intereses: r.Intereses,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Crea o actualiza la lista de intereses de un cliente.
     * Si ya existe, hace UPDATE; sino, INSERT.
     * @param {{ clienteId: number, intereses: string }} data
     * @returns {Promise<Intereses>}
     */
    async saveOrUpdate({ clienteId, intereses }) {
        // Verificar si ya existe un registro para este cliente
        const existing = await this.findByClienteId(clienteId);

        if (existing) {
            // Actualizar
            await pool.query(
                `UPDATE intereses
           SET Intereses = ?, updatedAt = NOW()
         WHERE InteresId = ?`,
                [intereses, existing.interesId]
            );
            return this.findByClienteId(clienteId);
        } else {
            // Insertar
            const [result] = await pool.query(
                `INSERT INTO intereses (ClienteId, Intereses, createdAt, updatedAt)
           VALUES (?, ?, NOW(), NOW())`,
                [clienteId, intereses]
            );
            const insertId = result.insertId;
            return this.findByClienteId(clienteId);
        }
    }
}

module.exports = MysqlInteresesRepository;
