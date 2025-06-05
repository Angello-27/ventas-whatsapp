// src/core/entities/Cliente.js

class Cliente {
    /**
     * @param {Object} params
     * @param {number} params.clienteId
     * @param {string} params.telefono
     * @param {string|null} params.nombre
     * @param {string|null} params.email
     * @param {Date} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({ clienteId, telefono, nombre = null, email = null, createdAt = null, isActive = true }) {
        this.clienteId = clienteId;
        this.telefono = telefono;
        this.nombre = nombre;
        this.email = email;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = Cliente;
