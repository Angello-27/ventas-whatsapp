class SesionChat {
  constructor({
    id, clienteId, iniciadoEn, finalizadoEn,
    createdAt, updatedAt, isActive
  }) {
    this.id            = id;            // SesionId
    this.clienteId     = clienteId;     // ClienteId
    this.iniciadoEn    = iniciadoEn;    // IniciadoEn
    this.finalizadoEn  = finalizadoEn;  // FinalizadoEn
    this.createdAt     = createdAt;
    this.updatedAt     = updatedAt;
    this.isActive      = Boolean(isActive);
  }
}

module.exports = SesionChat;
