// src/core/entities/Sesion.js

class Sesion {
    /**
     * @param {Object} params
     * @param {number} params.sesionId
     * @param {number} params.clienteId
     * @param {Date|null} params.iniciadoEn
     * @param {Date|null} params.finalizadoEn
     * @param {Object|null} params.ultimoContexto
     * @param {Date|null} params.createdAt
     * @param {boolean} params.isActive
     */
    constructor({
        sesionId,
        clienteId,
        iniciadoEn = null,
        finalizadoEn = null,
        ultimoContexto = null,
        createdAt = null,
        isActive = true
    }) {
        this.sesionId = sesionId;
        this.clienteId = clienteId;
        this.iniciadoEn = iniciadoEn;
        this.finalizadoEn = finalizadoEn;
        this.ultimoContexto = ultimoContexto;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}

module.exports = Sesion;
