// core/entities/Producto.js

class Producto {
    /**
     * @param {Object} params
     * @param {number} params.productoId
     * @param {string} params.nombre
     * @param {'Hombre'|'Mujer'|'Niños'|'Unisex'} params.genero
     * @param {number} params.marcaId
     * @param {number} params.categoriaId
     * @param {boolean} params.isActive
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({
        productoId,
        nombre,
        genero,
        marcaId,
        categoriaId,
        isActive = true,
        createdAt = null,
        updatedAt = null
    }) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.genero = genero;
        this.marcaId = marcaId;
        this.categoriaId = categoriaId;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Producto;
