class Inventario {
  constructor({ id, envaseId, almacenId, cantidad, createdAt, updatedAt, isActive }) {
    this.id        = id;        // InventarioId
    this.envaseId  = envaseId;  // EnvaseId
    this.almacenId = almacenId; // AlmacenId
    this.cantidad  = cantidad;  // Cantidad
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive  = Boolean(isActive);
  }
}

module.exports = Inventario;
