/**
 * Entidad Message
 */
class Message {
  constructor({ id, sessionId, timestamp, direction, content }) {
    this.id = id;
    this.sessionId = sessionId;
    this.timestamp = timestamp;  // Date
    this.direction = direction;  // 'INBOUND' | 'OUTBOUND'
    this.content = content;      // String
  }
}

module.exports = Message;