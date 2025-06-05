// src/core/entities/Variante.js

class Variante {
    /**
     * Representa una variante “aplanada” tal como sale de la vista `vistavariantesproductos`.
     * 
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
     * @param {string|null} params.imagenPrincipalUrl
     * @param {Date|null} params.createdAt
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
        imagenPrincipalUrl = null,
        createdAt = null
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
        this.imagenPrincipalUrl = imagenPrincipalUrl;
        this.createdAt = createdAt;
    }
}

module.exports = Variante;
