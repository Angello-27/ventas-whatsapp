/**
 * Entidad ChatSession (sesionchat)
 */
class ChatSession {
  constructor({ id, customerId, startedAt, endedAt }) {
    this.id         = id;
    this.customerId = customerId;
    this.startedAt  = startedAt;    // corresponde a IniciadoEn
    this.endedAt    = endedAt;      // corresponde a FinalizadoEn
  }
}

module.exports = ChatSession;