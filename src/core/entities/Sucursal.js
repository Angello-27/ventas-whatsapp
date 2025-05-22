class Sucursal {
  constructor({ id, nombre, ciudad, direccion, tipoSucursal, createdAt, updatedAt, isActive }) {
    this.id           = id;           // SucursalId
    this.nombre       = nombre;       // Nombre
    this.ciudad       = ciudad;       // Ciudad
    this.direccion    = direccion;    // Direccion
    this.tipoSucursal = tipoSucursal; // TipoSucursal
    this.createdAt    = createdAt;
    this.updatedAt    = updatedAt;
    this.isActive     = Boolean(isActive);
  }
}

module.exports = Sucursal;
