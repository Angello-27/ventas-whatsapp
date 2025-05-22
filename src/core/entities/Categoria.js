class Categoria {
  constructor({ id, nombre, padreCategoriaId, createdAt, updatedAt, isActive }) {
    this.id               = id;               // CategoriaId
    this.nombre           = nombre;           // Nombre
    this.padreCategoriaId = padreCategoriaId; // PadreCategoriaId
    this.createdAt        = createdAt;
    this.updatedAt        = updatedAt;
    this.isActive         = Boolean(isActive);
  }
}

module.exports = Categoria;
