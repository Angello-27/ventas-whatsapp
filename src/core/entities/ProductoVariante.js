// src/core/entities/ProductoVariante.js
class ProductoVariante {
    /**
     * @param {Object} params
     * @param {number} params.varianteId
     * @param {string} params.sku
     * @param {number} params.productoId
     * @param {string} params.productoNombre
     * @param {string} params.color
     * @param {string} params.talla
     * @param {string|null} params.material
     * @param {number} params.precioVenta
     * @param {number} params.cantidad
     * @param {Date|string|null} params.asignadoEn    // alias de createdAt en la vista
     */
    constructor({
        varianteId,
        sku,
        productoId,
        productoNombre,
        color,
        talla,
        material = null,
        precioVenta,
        cantidad,
        asignadoEn = null
    }) {
        this.varianteId = varianteId;
        this.sku = sku;
        this.productoId = productoId;
        this.productoNombre = productoNombre;
        this.color = color;
        this.talla = talla;
        this.material = material;
        this.precioVenta = precioVenta;
        this.cantidad = cantidad;
        this.asignadoEn = asignadoEn instanceof Date ? asignadoEn : asignadoEn && new Date(asignadoEn);
    }
}

module.exports = ProductoVariante;
