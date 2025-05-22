class CampanaItem {
  constructor({ id, campanaId, envaseId, cantidad, createdAt, updatedAt, isActive }) {
    this.id         = id;         // ItemId
    this.campanaId  = campanaId;  // CampanaId
    this.envaseId   = envaseId;   // EnvaseId
    this.cantidad   = cantidad;   // Cantidad
    this.createdAt  = createdAt;
    this.updatedAt  = updatedAt;
    this.isActive   = Boolean(isActive);
  }
}

module.exports = CampanaItem;
