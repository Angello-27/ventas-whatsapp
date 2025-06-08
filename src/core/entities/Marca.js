// src/core/entities/Marca.js

class Marca {
    /**
     * @param {Object} params
     * @param {number} params.marcaId
     * @param {string} params.nombre
     * @param {string|null} params.logoUrl
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        marcaId,
        nombre,
        logoUrl = null,
        createdAt = null,
        isActive = true
    }) {
        this.marcaId = marcaId;
        this.nombre = nombre;
        this.logoUrl = logoUrl;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = Marca;
