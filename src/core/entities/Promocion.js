// src/core/entities/Promocion.js
class Promocion {
    /**
     * @param {Object} params
     * @param {number} params.promocionId
     * @param {string} params.titulo
     * @param {number} params.descuento          // porcentaje de descuento
     * @param {Date|string} params.fechaInicio
     * @param {Date|string} params.fechaFin
     * @param {'Categoria'|'Marca'|'Producto'} params.tipoPromo
     * @param {number} params.targetId
     * @param {string} params.targetNombre
     * @param {number} params.cobertura
     * @param {'Hombre'|'Mujer'|'Niños'|'Unisex'} params.genero
     * @param {Date|string|null} params.asignadoEn  // alias de createdAt en la vista
     */
    constructor({
        promocionId,
        titulo,
        descuento,
        fechaInicio,
        fechaFin,
        tipoPromo,
        targetId,
        targetNombre,
        cobertura,
        genero,
        asignadoEn = null
    }) {
        this.promocionId = promocionId;
        this.titulo = titulo;
        this.descuento = descuento;
        this.fechaInicio = fechaInicio instanceof Date ? fechaInicio : new Date(fechaInicio);
        this.fechaFin = fechaFin instanceof Date ? fechaFin : new Date(fechaFin);
        this.tipoPromo = tipoPromo;
        this.targetId = targetId;
        this.targetNombre = targetNombre;
        this.cobertura = cobertura;
        this.genero = genero;
        this.asignadoEn = asignadoEn instanceof Date ? asignadoEn : asignadoEn && new Date(asignadoEn);
    }
}

module.exports = Promocion;
