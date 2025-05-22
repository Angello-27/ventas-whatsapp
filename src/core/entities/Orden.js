class Orden {
  constructor({ id, clienteId, createdAt, updatedAt, isActive }) {
    this.id         = id;         // OrdenId
    this.clienteId  = clienteId;  // ClienteId
    this.createdAt  = createdAt;
    this.updatedAt  = updatedAt;
    this.isActive   = Boolean(isActive);
  }
}

module.exports = Orden;