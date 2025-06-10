// src/infrastructure/db/MySQLChatRepository.js
const IChatRepository = require('../../core/repositories/IChatRepository'); //  Usar interfaz combinada
const Cliente = require('../../core/entities/Cliente');
const Sesion = require('../../core/entities/Sesion');
const Mensaje = require('../../core/entities/Mensaje');

const pool = require('./mysqlPool');

class MySQLChatRepository extends IChatRepository {
    constructor() {
        super(); // ✅ Simplificar, ya no necesitas Object.assign múltiples
    }

    //
    // ----- Métodos de IClienteRepository -----
    //

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

    async create({ nombre = null, telefono, email = null }) {
        const sql = `
            INSERT INTO clientes (Nombre, Telefono, Email, createdAt, isActive)
            VALUES (?, ?, ?, NOW(), 1)
        `;
        const [result] = await pool.query(sql, [nombre, telefono, email]);
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
    // ----- Métodos de ISesionRepository -----
    //

    async findActiveByClienteId(clienteId) {
        const sql = `
        SELECT SesionId, ClienteId, IniciadoEn, FinalizadoEn, 
               UltimoContexto, IsActive, createdAt
        FROM sesiones
        WHERE ClienteId = ? AND FinalizadoEn IS NULL AND IsActive = 1
        ORDER BY IniciadoEn DESC
        LIMIT 1
    `;
        const [rows] = await pool.query(sql, [clienteId]);
        if (!rows.length) return null;

        const r = rows[0];
        const sesion = new Sesion({
            sesionId: r.SesionId,
            clienteId: r.ClienteId,
            iniciadoEn: r.IniciadoEn,
            finalizadoEn: r.FinalizadoEn,
            ultimoContexto: r.UltimoContexto, // ✅ CORREGIDO: UltimoContexto (no ultimoContexto)
            isActive: Boolean(r.IsActive),    // ✅ CORREGIDO: IsActive (no isActive)
            createdAt: r.createdAt
        });

        console.log('📋 Sesión cargada:', {
            sesionId: sesion.sesionId,
            tieneContexto: sesion.hasContexto ? sesion.hasContexto() : false,
            metodos: typeof sesion.setContexto === 'function' ? '✅' : '❌',
            contextoRaw: r.UltimoContexto
        });

        return sesion;
    }

    async createSession({ clienteId }) {
        const sql = `
        INSERT INTO sesiones (ClienteId, IniciadoEn, FinalizadoEn, UltimoContexto, createdAt, IsActive)
        VALUES (?, NOW(), NULL, NULL, NOW(), 1)
    `;
        const [result] = await pool.query(sql, [clienteId]);
        const insertId = result.insertId;

        const [rows] = await pool.query(
            `SELECT SesionId, ClienteId, IniciadoEn, FinalizadoEn, 
                UltimoContexto, IsActive, createdAt
         FROM sesiones
         WHERE SesionId = ?
         LIMIT 1`,
            [insertId]
        );
        const r = rows[0];
        return new Sesion({
            sesionId: r.SesionId,
            clienteId: r.ClienteId,
            iniciadoEn: r.IniciadoEn,
            finalizadoEn: r.FinalizadoEn,
            ultimoContexto: r.UltimoContexto, // ✅ CORREGIDO
            isActive: Boolean(r.IsActive),    // ✅ CORREGIDO
            createdAt: r.createdAt
        });
    }

    async endSession(sesionId) {
        const sql = `
            UPDATE sesiones
            SET FinalizadoEn = NOW(),
                isActive = 0
            WHERE SesionId = ?
        `;
        await pool.query(sql, [sesionId]);
    }

    // ✅ NUEVOS métodos para contexto
    async updateSessionContext(sesionId, contextObj) {
        const json = JSON.stringify(contextObj);
        const sql = `
        UPDATE sesiones 
        SET UltimoContexto = ? 
        WHERE SesionId = ?
        `;
        await pool.query(sql, [json, sesionId]);
    }

    async getSessionContext(sesionId) {
        const sql = `
        SELECT UltimoContexto 
        FROM sesiones 
        WHERE SesionId = ?
        `;
        const [rows] = await pool.query(sql, [sesionId]);
        if (!rows.length || !rows[0].UltimoContexto) return null;

        try {
            return JSON.parse(rows[0].UltimoContexto);
        } catch (err) {
            console.warn('Error parsing session context:', err);
            return null;
        }
    }

    //
    // ----- Métodos de IMensajeRepository -----
    //

    async saveMessage({ sesionId, direccion, contenido }) {
        const sql = `
            INSERT INTO mensajes (SesionId, Direccion, Contenido, createdAt, isActive)
            VALUES (?, ?, ?, NOW(), 1)
        `;
        const [result] = await pool.query(sql, [sesionId, direccion, contenido]);
        const insertId = result.insertId;

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