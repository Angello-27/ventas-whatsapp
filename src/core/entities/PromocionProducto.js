// src/core/entities/PromocionProducto.js
class PromocionProducto {
    /**
     * @param {Object} params
     * @param {number} params.id                   // alias de PromocionProductoId en la vista
     * @param {number} params.promocionId
     * @param {string} params.promocionTitulo
     * @param {number} params.productoId
     * @param {string} params.productoNombre
     * @param {string} params.productoGenero
     * @param {string} params.categoriaNombre
     * @param {string} params.marcaNombre
     * @param {Date|string|null} params.asignadoEn // alias de createdAt en la vista
     */
    constructor({
        id,
        promocionId,
        promocionTitulo,
        productoId,
        productoNombre,
        productoGenero,
        categoriaNombre,
        marcaNombre,
        asignadoEn = null
    }) {
        this.promocionProductoId = id;
        this.promocionId = promocionId;
        this.promocionTitulo = promocionTitulo;
        this.productoId = productoId;
        this.productoNombre = productoNombre;
        this.productoGenero = productoGenero;
        this.categoriaNombre = categoriaNombre;
        this.marcaNombre = marcaNombre;
        this.asignadoEn = asignadoEn instanceof Date ? asignadoEn : asignadoEn && new Date(asignadoEn);
    }
}

module.exports = PromocionProducto;
