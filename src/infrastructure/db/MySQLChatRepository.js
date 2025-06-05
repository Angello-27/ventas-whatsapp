// src/infrastructure/db/MySQLChatRepository.js

const IClienteRepository = require('../../core/repositories/IClienteRepository');
const ISesionChatRepository = require('../../core/repositories/ISesionChatRepository');
const IMensajeRepository = require('../../core/repositories/IMensajeRepository');

const Cliente = require('../../core/entities/Cliente');
const SesionChat = require('../../core/entities/SesionChat');
const Mensaje = require('../../core/entities/Mensaje');

const pool = require('./mysqlPool');

class MySQLChatRepository extends IClienteRepository {
    constructor() {
        super();
        // Heredamos IClienteRepository, luego mezclamos manualmente ISesionChatRepository e IMensajeRepository:
        Object.assign(this, new ISesionChatRepository());
        Object.assign(this, new IMensajeRepository());
    }

    //
    // ----- Métodos de IClienteRepository -----
    //

    /**
     * Busca un cliente por teléfono (sin prefijo “whatsapp:”).
     * @param {string} telefono
     * @returns {Promise<Cliente|null>}
     */
    async findByTelefono(telefono) {
        const sql = `
      SELECT ClienteId, Telefono, Nombre, Email, createdAt, isActive
      FROM clientes
      WHERE Telefono = ? AND isActive = 1
      LIMIT 1
    `;
        const [rows] = await pool.query(sql, [telefono]);
        if (!rows.length) return null;

        const r = rows[0];
        return new Cliente({
            clienteId: r.ClienteId,
            telefono: r.Telefono,
            nombre: r.Nombre,
            email: r.Email,
            createdAt: r.createdAt,
            isActive: Boolean(r.isActive)
        });
    }

    /**
     * Crea un nuevo cliente en la tabla `clientes`.
     * @param {{ nombre: string|null, telefono: string, email: string|null }} data
     * @returns {Promise<Cliente>}
     */
    async create({ nombre = null, telefono, email = null }) {
        const sql = `
      INSERT INTO clientes (Nombre, Telefono, Email, createdAt, isActive)
      VALUES (?, ?, ?, NOW(), 1)
    `;
        const [result] = await pool.query(sql, [nombre, telefono, email]);
        // Luego recuperamos el registro recién insertado:
        const insertId = result.insertId;
        const [rows] = await pool.query(
            `SELECT ClienteId, Telefono, Nombre, Email, createdAt, isActive
         FROM clientes
         WHERE ClienteId = ?
         LIMIT 1`,
            [insertId]
        );
        const r = rows[0];
        return new Cliente({
            clienteId: r.ClienteId,
            telefono: r.Telefono,
            nombre: r.Nombre,
            email: r.Email,
            createdAt: r.createdAt,
            isActive: Boolean(r.isActive)
        });
    }

    //
    // ----- Métodos de ISesionChatRepository -----
    //

    /**
     * Busca la sesión activa de un cliente (FinalizadoEn IS NULL y isActive = 1).
     * @param {number} clienteId
     * @returns {Promise<SesionChat|null>}
     */
    async findActiveByClienteId(clienteId) {
        const sql = `
      SELECT SesionId, ClienteId, IniciadoEn, FinalizadoEn, isActive, createdAt, updatedAt
      FROM sesiones
      WHERE ClienteId = ? AND FinalizadoEn IS NULL AND isActive = 1
      ORDER BY IniciadoEn DESC
      LIMIT 1
    `;
        const [rows] = await pool.query(sql, [clienteId]);
        if (!rows.length) return null;

        const r = rows[0];
        return new SesionChat({
            sesionId: r.SesionId,
            clienteId: r.ClienteId,
            iniciadoEn: r.IniciadoEn,
            finalizadoEn: r.FinalizadoEn,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Crea una nueva sesión para un cliente (createdAt, updatedAt se ponen con NOW()).
     * @param {{ clienteId: number }} data
     * @returns {Promise<SesionChat>}
     */
    async createSession({ clienteId }) {
        const sql = `
      INSERT INTO sesiones (ClienteId, IniciadoEn, FinalizadoEn, createdAt, updatedAt, isActive)
      VALUES (?, NOW(), NULL, NOW(), NOW(), 1)
    `;
        const [result] = await pool.query(sql, [clienteId]);
        const insertId = result.insertId;

        // Recuperamos la sesión recien creada
        const [rows] = await pool.query(
            `SELECT SesionId, ClienteId, IniciadoEn, FinalizadoEn, isActive, createdAt, updatedAt
         FROM sesiones
         WHERE SesionId = ?
         LIMIT 1`,
            [insertId]
        );
        const r = rows[0];
        return new SesionChat({
            sesionId: r.SesionId,
            clienteId: r.ClienteId,
            iniciadoEn: r.IniciadoEn,
            finalizadoEn: r.FinalizadoEn,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Marca una sesión como finalizada (FinalizadoEn=NOW(), isActive=0, updatedAt=NOW()).
     * @param {number} sesionId
     * @returns {Promise<void>}
     */
    async endSession(sesionId) {
        const sql = `
      UPDATE sesiones
      SET FinalizadoEn = NOW(),
          isActive     = 0,
          updatedAt    = NOW()
      WHERE SesionId = ?
    `;
        await pool.query(sql, [sesionId]);
    }

    //
    // ----- Métodos de IMensajeRepository -----
    //

    /**
     * Guarda un mensaje en la tabla `mensajes`.
     * @param {{ sesionId: number, direccion: 'Entrante'|'Saliente', contenido: string }} data
     * @returns {Promise<Mensaje>}
     */
    async saveMessage({ sesionId, direccion, contenido }) {
        const sql = `
      INSERT INTO mensajes (SesionId, Direccion, Contenido, createdAt, isActive)
      VALUES (?, ?, ?, NOW(), 1)
    `;
        const [result] = await pool.query(sql, [sesionId, direccion, contenido]);
        const insertId = result.insertId;

        // Recuperar el mensaje recien insertado
        const [rows] = await pool.query(
            `SELECT MensajeId, SesionId, Direccion, Contenido, createdAt, isActive
         FROM mensajes
         WHERE MensajeId = ?
         LIMIT 1`,
            [insertId]
        );
        const r = rows[0];
        return new Mensaje({
            mensajeId: r.MensajeId,
            sesionId: r.SesionId,
            direccion: r.Direccion,
            contenido: r.Contenido,
            createdAt: r.createdAt,
            isActive: Boolean(r.isActive)
        });
    }

    /**
     * Recupera todos los mensajes activos de una sesión, ordenados por fecha ascendente.
     * @param {number} sesionId
     * @returns {Promise<Mensaje[]>}
     */
    async findMessagesBySesionId(sesionId) {
        const sql = `
      SELECT MensajeId, SesionId, Direccion, Contenido, createdAt, isActive
      FROM mensajes
      WHERE SesionId = ? AND isActive = 1
      ORDER BY createdAt ASC
    `;
        const [rows] = await pool.query(sql, [sesionId]);
        return rows.map(r => new Mensaje({
            mensajeId: r.MensajeId,
            sesionId: r.SesionId,
            direccion: r.Direccion,
            contenido: r.Contenido,
            createdAt: r.createdAt,
            isActive: Boolean(r.isActive)
        }));
    }
}

module.exports = MySQLChatRepository;
