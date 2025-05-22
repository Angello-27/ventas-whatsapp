class CampanaAmbito {
  constructor({ id, campanaId, tipoAmbito, objetoId, createdAt, updatedAt, isActive }) {
    this.id         = id;         // AlcanceId
    this.campanaId  = campanaId;  // CampanaId
    this.tipoAmbito = tipoAmbito; // TipoAmbito
    this.objetoId   = objetoId;   // ObjetoId
    this.createdAt  = createdAt;
    this.updatedAt  = updatedAt;
    this.isActive   = Boolean(isActive);
  }
}

module.exports = CampanaAmbito;
