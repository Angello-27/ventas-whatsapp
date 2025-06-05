// src/infrastructure/openai/prompts/userChatPrompt.js

/**
 * buildUserChatPrompt:
 *   Recibe:
 *     - from: número de teléfono del cliente (string).
 *     - body: texto actual del cliente.
 *     - history: (opcional) breve resumen de la conversación previa.
 *
 *   Construye y devuelve un prompt para enviar a GPT.
 */
function buildUserChatPrompt({ from, body }) {
  return `Cliente (${from}) escribió: "${body}"`.trim();
}

module.exports = { buildUserChatPrompt };
