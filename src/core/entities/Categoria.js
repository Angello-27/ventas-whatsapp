// src/core/entities/Categoria.js

class Categoria {
    /**
     * @param {Object} params
     * @param {number} params.categoriaId
     * @param {string} params.nombre
     * @param {number|null} params.padreCategoriaId
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        categoriaId,
        nombre,
        padreCategoriaId = null,
        createdAt = null,
        isActive = true
    }) {
        this.categoriaId = categoriaId;
        this.nombre = nombre;
        this.padreCategoriaId = padreCategoriaId;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = Categoria;
