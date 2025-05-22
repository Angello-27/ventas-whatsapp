class Almacen {
  constructor({ id, nombre, direccion, sucursalId, createdAt, updatedAt, isActive }) {
    this.id         = id;          // AlmacenId
    this.nombre     = nombre;      // Nombre
    this.direccion  = direccion;   // Direccion
    this.sucursalId = sucursalId;  // SucursalId
    this.createdAt  = createdAt;
    this.updatedAt  = updatedAt;
    this.isActive   = Boolean(isActive);
  }
}

module.exports = Almacen;
