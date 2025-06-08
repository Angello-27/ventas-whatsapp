// src/core/entities/ClienteInteres.js

class ClienteInteres {
    /**
     * @param {Object} params
     * @param {number} params.interesId
     * @param {number} params.clienteId
     * @param {string} params.intereses
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        interesId,
        clienteId,
        intereses,
        createdAt = null,
        isActive = true
    }) {
        this.interesId = interesId;
        this.clienteId = clienteId;
        this.intereses = intereses;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = ClienteInteres;
