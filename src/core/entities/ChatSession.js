/**
 * Entidad ChatSession
 */
class ChatSession {
  constructor({ id, customerId, startedAt, endedAt }) {
    this.id = id;
    this.customerId = customerId;
    this.startedAt = startedAt;  // Date
    this.endedAt = endedAt;      // Date | null
  }
}

module.exports = ChatSession;