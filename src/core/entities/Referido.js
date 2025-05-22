class Referido {
  constructor({ id, referidorId, referidoPorId, createdAt, updatedAt, isActive }) {
    this.id            = id;            // ReferidoId
    this.referidorId   = referidorId;   // ReferidorId
    this.referidoPorId = referidoPorId; // ReferidoPorId
    this.createdAt     = createdAt;
    this.updatedAt     = updatedAt;
    this.isActive      = Boolean(isActive);
  }
}

module.exports = Referido;
