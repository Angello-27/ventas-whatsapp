class ItemOrden {
  constructor({ id, ordenId, envaseId, cantidad, precioUnitario, createdAt, updatedAt, isActive }) {
    this.id             = id;             // ItemOrdenId
    this.ordenId        = ordenId;        // OrdenId
    this.envaseId       = envaseId;       // EnvaseId
    this.cantidad       = cantidad;       // Cantidad
    this.precioUnitario = precioUnitario; // PrecioUnitario
    this.createdAt      = createdAt;
    this.updatedAt      = updatedAt;
    this.isActive       = Boolean(isActive);
  }
}

module.exports = ItemOrden;