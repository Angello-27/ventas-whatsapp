class Marca {
  constructor({ id, nombre, logoUrl, proveedorId, createdAt, updatedAt, isActive }) {
    this.id          = id;          // MarcaId
    this.nombre      = nombre;      // Nombre
    this.logoUrl     = logoUrl;     // LogoUrl
    this.proveedorId = proveedorId; // ProveedorId
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.isActive    = Boolean(isActive);
  }
}

module.exports = Marca;