// core/entities/Variante.js

class Variante {
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
     * @param {boolean} params.isActive
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
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
        isActive = true,
        createdAt = null,
        updatedAt = null
    }) {
        this.varianteId = varianteId;
        this.productoId = productoId;
        this.color = color;
        this.talla = talla;
        this.material = material;
        this.sku = sku;
        this.precioVenta = precioVenta;
        this.cantidad = cantidad;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Variante;
