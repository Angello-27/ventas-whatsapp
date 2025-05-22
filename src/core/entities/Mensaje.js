class Mensaje {
  constructor({
    id, sesionId, fechaEnvio, direccion, contenido,
    createdAt, updatedAt, isActive
  }) {
    this.id          = id;          // MensajeId
    this.sesionId    = sesionId;    // SesionId
    this.fechaEnvio  = fechaEnvio;  // FechaEnvio
    this.direccion   = direccion;   // Direccion
    this.contenido   = contenido;   // Contenido
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.isActive    = Boolean(isActive);
  }
}

module.exports = Mensaje;
