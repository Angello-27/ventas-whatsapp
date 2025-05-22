class Proveedor {
  constructor({ id, nombre, contacto, createdAt, updatedAt, isActive }) {
    this.id        = id;        // ProveedorId
    this.nombre    = nombre;    // Nombre
    this.contacto = contacto;   // Contacto
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive  = Boolean(isActive);
  }
}

module.exports = Proveedor;
