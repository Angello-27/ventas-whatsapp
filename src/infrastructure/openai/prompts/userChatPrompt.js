// src/infrastructure/openai/prompts/userChatPrompt.js

/**
 * buildUserChatPrompt:
 *   Recibe:
 *     - from: número de teléfono del cliente (string).
 *     - body: texto original que envió el cliente.
 *     - history: (opcional) resumen muy breve de las interacciones previas.
 *
 *   Construye y devuelve un prompt (string) para enviarle a GPT.
 */
function buildUserChatPrompt({ from, body, history = '' }) {
  // Solo incluimos el mensaje actual; el "history" puede ser un pequeño resumen
  // (pocas líneas) de lo que se ha conversado antes, para dar contexto.
  // Si es la primera interacción, history estará vacío.
  let prompt = `Cliente (${from}) escribió: "${body}"`;

  if (history) {
    prompt = `Historial resumido:\n${history}\n\n` + prompt;
  }

  return prompt.trim();
}

module.exports = { buildUserChatPrompt };
