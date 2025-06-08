// src/core/entities/Promocion.js

class Promocion {
    /**
     * @param {Object} params
     * @param {number} params.promocionId
     * @param {string} params.titulo
     * @param {number} params.descuentoPct
     * @param {string|Date} params.fechaInicio   // YYYY-MM-DD o Date
     * @param {string|Date} params.fechaFin      // YYYY-MM-DD o Date
     * @param {'Categoria'|'Marca'|'Producto'} params.tipoPromo
     * @param {number} params.targetId
     * @param {number} params.cobertura
     * @param {'Hombre'|'Mujer'|'Niños'|'Unisex'} params.genero
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        promocionId,
        titulo,
        descuentoPct,
        fechaInicio,
        fechaFin,
        tipoPromo,
        targetId,
        cobertura = 1.0,
        genero = 'Unisex',
        createdAt = null,
        isActive = true
    }) {
        this.promocionId = promocionId;
        this.titulo = titulo;
        this.descuentoPct = descuentoPct;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.tipoPromo = tipoPromo;
        this.targetId = targetId;
        this.cobertura = cobertura;
        this.genero = genero;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = Promocion;
