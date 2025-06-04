// core/entities/Mensaje.js

class Mensaje {
    /**
     * @param {Object} params
     * @param {number} params.mensajeId
     * @param {number} params.sesionId
     * @param {'Entrante'|'Saliente'} params.direccion
     * @param {string} params.contenido
     * @param {Date|null} params.timestamp
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({
        mensajeId,
        sesionId,
        direccion,
        contenido,
        timestamp = null,
        createdAt = null,
        updatedAt = null
    }) {
        this.mensajeId = mensajeId;
        this.sesionId = sesionId;
        this.direccion = direccion;
        this.contenido = contenido;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Mensaje;
