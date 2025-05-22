class CuentaFidelidad {
  constructor({ id, clienteId, puntosBalance, nivel, createdAt, updatedAt, isActive }) {
    this.id            = id;            // CuentaId
    this.clienteId     = clienteId;     // ClienteId
    this.puntosBalance = puntosBalance; // PuntosBalance
    this.nivel         = nivel;         // Nivel
    this.createdAt     = createdAt;
    this.updatedAt     = updatedAt;
    this.isActive      = Boolean(isActive);
  }
}

module.exports = CuentaFidelidad;
