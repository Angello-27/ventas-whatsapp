class EnvaseProducto {
  constructor({ id, sku, descripcion, productoId, atributos, createdAt, updatedAt, isActive }) {
    this.id          = id;          // EnvaseId
    this.sku         = sku;         // SKU
    this.descripcion = descripcion; // Descripcion
    this.productoId  = productoId;  // ProductoId
    this.atributos   = atributos ? JSON.parse(atributos) : null; // Atributos JSON
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.isActive    = Boolean(isActive);
  }
}

module.exports = EnvaseProducto;
