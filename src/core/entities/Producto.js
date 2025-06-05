// src/core/entities/Producto.js

class Producto {
    /**logoUrl
     * @param {Object} params
     * @param {number} params.productoId
     * @param {string} params.nombre
     * @param {'Hombre'|'Mujer'|'Niños'|'Unisex'} params.genero
     * @param {number} params.marcaId
     * @param {string} params.marcaNombre
     * @param {string} params.logoUrl
     * @param {number} params.categoriaId
     * @param {string} params.categoriaNombre
     * @param {Date|null} params.createdAt
     */
    constructor({
        productoId,
        nombre,
        genero,
        marcaId,
        marcaNombre,
        logoUrl,
        categoriaId,
        categoriaNombre,
        createdAt = null
    }) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.genero = genero;
        this.marcaId = marcaId;
        this.marcaNombre = marcaNombre;
        this.logoUrl = logoUrl;
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
        this.createdAt = createdAt;
    }
}

module.exports = Producto;
