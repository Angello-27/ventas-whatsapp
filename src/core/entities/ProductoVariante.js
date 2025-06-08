// src/core/entities/ProductoVariante.js

class ProductoVariante {
    /**
     * @param {Object} params
     * @param {number} params.varianteId
     * @param {number} params.productoId
     * @param {string} params.color
     * @param {string} params.talla
     * @param {string|null} params.material
     * @param {string} params.sku
     * @param {number} params.precioVenta
     * @param {number} params.cantidad
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        varianteId,
        productoId,
        color,
        talla,
        material = null,
        sku,
        precioVenta,
        cantidad,
        createdAt = null,
        isActive = true
    }) {
        this.varianteId = varianteId;
        this.productoId = productoId;
        this.color = color;
        this.talla = talla;
        this.material = material;
        this.sku = sku;
        this.precioVenta = precioVenta;
        this.cantidad = cantidad;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = ProductoVariante;
