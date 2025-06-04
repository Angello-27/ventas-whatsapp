// core/entities/Cliente.js

class Cliente {
    /**
     * @param {Object} params
     * @param {number} params.clienteId
     * @param {string} params.telefono
     * @param {string|null} params.nombre
     * @param {string|null} params.email
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({ clienteId, telefono, nombre = null, email = null, createdAt = null, updatedAt = null }) {
        this.clienteId = clienteId;
        this.telefono = telefono;
        this.nombre = nombre;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Cliente;
