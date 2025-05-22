class Producto {
  constructor({ id, nombre, marcaId, categoriaId, createdAt, updatedAt, isActive }) {
    this.id          = id;          // ProductoId
    this.nombre      = nombre;      // Nombre
    this.marcaId     = marcaId;     // MarcaId
    this.categoriaId = categoriaId; // CategoriaId
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.isActive    = Boolean(isActive);
  }
}

module.exports = Producto;
