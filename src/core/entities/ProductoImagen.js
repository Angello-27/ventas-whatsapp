// src/core/entities/ProductoImagen.js

class ProductoImagen {
    /**
     * @param {Object} params
     * @param {number} params.imagenId
     * @param {number} params.productoId
     * @param {number|null} params.varianteId
     * @param {string} params.url
     * @param {boolean} params.esPrincipal
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        imagenId,
        productoId,
        varianteId = null,
        url,
        esPrincipal = false,
        createdAt = null,
        isActive = true
    }) {
        this.imagenId = imagenId;
        this.productoId = productoId;
        this.varianteId = varianteId;
        this.url = url;
        this.esPrincipal = esPrincipal;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = ProductoImagen;
