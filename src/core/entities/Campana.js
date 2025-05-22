class Campana {
  constructor({ id, nombre, descripcion, tipo, fechaInicio, fechaFin, parametros, createdAt, updatedAt, isActive }) {
    this.id          = id;               // CampanaId
    this.nombre      = nombre;           // Nombre
    this.descripcion = descripcion;      // Descripción
    this.tipo        = tipo;             // Tipo
    this.fechaInicio = fechaInicio;      // FechaInicio
    this.fechaFin    = fechaFin;         // FechaFin
    this.parametros  = parametros ? JSON.parse(parametros) : null; // Parámetros JSON
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.isActive    = Boolean(isActive);
  }
}

module.exports = Campana;
