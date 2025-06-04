// core/entities/Promocion.js

class Promocion {
    /**
     * @param {Object} params
     * @param {number} params.promocionId
     * @param {string} params.titulo
     * @param {number} params.descuentoPct
     * @param {string|Date} params.fechaInicio   // YYYY-MM-DD o Date
     * @param {string|Date} params.fechaFin      // YYYY-MM-DD o Date
     * @param {boolean} params.activa
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({
        promocionId,
        titulo,
        descuentoPct,
        fechaInicio,
        fechaFin,
        activa = true,
        createdAt = null,
        updatedAt = null
    }) {
        this.promocionId = promocionId;
        this.titulo = titulo;
        this.descuentoPct = descuentoPct;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.activa = activa;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Promocion;
