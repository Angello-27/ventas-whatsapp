// src/core/entities/SesionChat.js

class SesionChat {
    /**
     * @param {Object} params
     * @param {number} params.sesionId
     * @param {number} params.clienteId
     * @param {Date} params.iniciadoEn
     * @param {Date|null} params.finalizadoEn
     * @param {boolean} params.isActive
     * @param {Date} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({
        sesionId,
        clienteId,
        iniciadoEn = null,
        finalizadoEn = null,
        isActive = true,
        createdAt = null,
        updatedAt = null
    }) {
        this.sesionId = sesionId;
        this.clienteId = clienteId;
        this.iniciadoEn = iniciadoEn;
        this.finalizadoEn = finalizadoEn;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = SesionChat;
