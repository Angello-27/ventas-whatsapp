// src/infrastructure/openai/prompts/userChatPrompt.js

/**
 * buildUserChatPrompt:
 *   Recibe:
 *     - from: número de teléfono del cliente.
 *     - body: texto puro que envió el cliente.
 *   Devuelve el prompt de usuario que irá tras el system prompt.
 */
function buildUserChatPrompt({ from, body }) {
  return `Cliente (${from}) escribió: "${body}"`.trim();
}

module.exports = { buildUserChatPrompt };
