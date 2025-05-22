/**
 * Entidad Message (mensaje)
 */
class Message {
  constructor({ id, sessionId, timestamp, direction, content }) {
    this.id        = id;
    this.sessionId = sessionId;
    this.timestamp = timestamp;     // corresponde a FechaEnvio
    this.direction = direction;     // 'Entrante' | 'Saliente'
    this.content   = content;
  }
}

module.exports = Message;