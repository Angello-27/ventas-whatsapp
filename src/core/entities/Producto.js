// src/core/entities/Producto.js
class Producto {
    /**
     * @param {Object} params
     * @param {number} params.productoId
     * @param {string} params.nombre
     * @param {'Hombre'|'Mujer'|'Niños'|'Unisex'} params.genero
     * @param {number} params.marcaId
     * @param {string} params.marcaNombre
     * @param {number} params.categoriaId
     * @param {string} params.categoriaNombre
     * @param {Date|string|null} params.asignadoEn    // alias de createdAt en la vista
     */
    constructor({
        productoId,
        nombre,
        genero,
        marcaId,
        marcaNombre,
        categoriaId,
        categoriaNombre,
        asignadoEn = null
    }) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.genero = genero;
        this.marcaId = marcaId;
        this.marcaNombre = marcaNombre;
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
        this.asignadoEn = asignadoEn instanceof Date ? asignadoEn : asignadoEn && new Date(asignadoEn);
    }
}

module.exports = Producto;
