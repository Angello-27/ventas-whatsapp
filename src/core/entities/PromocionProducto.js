// src/core/entities/PromocionProducto.js

class PromocionProducto {
    /**
     * @param {Object} params
     * @param {number} params.promocionProductoId
     * @param {number} params.promocionId
     * @param {number} params.productoId
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        promocionProductoId,
        promocionId,
        productoId,
        createdAt = null,
        isActive = true
    }) {
        this.promocionProductoId = promocionProductoId;
        this.promocionId = promocionId;
        this.productoId = productoId;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = PromocionProducto;
