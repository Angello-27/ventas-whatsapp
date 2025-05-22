class Precio {
  constructor({ id, envaseId, tipoPrecio, umbralCantidad, monto, vigenteDesde, vigenteHasta, createdAt, updatedAt, isActive }) {
    this.id              = id;               // PrecioId
    this.envaseId        = envaseId;         // EnvaseId
    this.tipoPrecio      = tipoPrecio;       // TipoPrecio
    this.umbralCantidad  = umbralCantidad;   // UmbralCantidad
    this.monto           = monto;            // Monto
    this.vigenteDesde    = vigenteDesde;     // VigenteDesde
    this.vigenteHasta    = vigenteHasta;     // VigenteHasta
    this.createdAt       = createdAt;
    this.updatedAt       = updatedAt;
    this.isActive        = Boolean(isActive);
  }
}

module.exports = Precio;
