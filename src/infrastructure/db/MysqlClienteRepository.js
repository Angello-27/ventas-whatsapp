// infrastructure/db/MysqlClienteRepository.js

const IClienteRepository = require('../../core/repositories/IClienteRepository');
const Cliente = require('../../core/entities/Cliente');
const pool = require('./mysqlPool');

class MysqlClienteRepository extends IClienteRepository {
    /**
     * Busca un cliente por su teléfono.
     * @param {string} telefono
     * @returns {Promise<Cliente|null>}
     */
    async findByTelefono(telefono) {
        const [rows] = await pool.query(
            `SELECT ClienteId, Telefono, Nombre, Email, createdAt, updatedAt
         FROM clientes
         WHERE Telefono = ?`,
            [telefono]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Cliente({
            clienteId: r.ClienteId,
            telefono: r.Telefono,
            nombre: r.Nombre,
            email: r.Email,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Busca un cliente por su ID.
     * @param {number} clienteId
     * @returns {Promise<Cliente|null>}
     */
    async findById(clienteId) {
        const [rows] = await pool.query(
            `SELECT ClienteId, Telefono, Nombre, Email, createdAt, updatedAt
         FROM clientes
         WHERE ClienteId = ?`,
            [clienteId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Cliente({
            clienteId: r.ClienteId,
            telefono: r.Telefono,
            nombre: r.Nombre,
            email: r.Email,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Crea un nuevo cliente.
     * @param {{ telefono: string, nombre?: string, email?: string }} data
     * @returns {Promise<Cliente>}
     */
    async create({ telefono, nombre = null, email = null }) {
        const [result] = await pool.query(
            `INSERT INTO clientes (Telefono, Nombre, Email, createdAt, updatedAt)
         VALUES (?, ?, ?, NOW(), NOW())`,
            [telefono, nombre, email]
        );
        const insertId = result.insertId;
        return this.findById(insertId);
    }
}

module.exports = MysqlClienteRepository;
