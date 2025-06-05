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
function buildUserChatPrompt({ from, body, history = '' }) {
  // Si hay un historial breve, lo incluimos arriba. Si no, solo enviamos el mensaje.
  let prompt = `Cliente (${from}) escribió: "${body}"`;

  if (history) {
    prompt = `Historial resumido: ${history}\n\n` + prompt;
  }

  return prompt.trim();
}

module.exports = { buildUserChatPrompt };
