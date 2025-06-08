// src/core/entities/Mensaje.js

class Mensaje {
  /**
   * @param {Object} params
   * @param {number} params.mensajeId
   * @param {number} params.sesionId
   * @param {'Entrante'|'Saliente'} params.direccion
   * @param {string} params.contenido
   * @param {Date|null} params.createdAt
   * @param {boolean} params.isActive
   */
  constructor({
    mensajeId,
    sesionId,
    direccion,
    contenido,
    createdAt = null,
    isActive = true
  }) {
    this.mensajeId = mensajeId;
    this.sesionId = sesionId;
    this.direccion = direccion;
    this.contenido = contenido;
    this.createdAt = createdAt;
    this.isActive = isActive;
  }
}

module.exports = Mensaje;
