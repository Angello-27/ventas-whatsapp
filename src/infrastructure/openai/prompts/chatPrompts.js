// src/infrastructure/openai/prompts/baseChatPrompt.js

/**
 * buildSystemChatPrompt:
 *   Devuelve el “prompt de sistema” que describe el rol del asistente.
 *   Siempre va como primer mensaje en cada request a chatClient.chat().
 */
function buildSystemChatPrompt() {
  return `
Eres un asistente de ventas de ropa.
Tu tarea es: 
 • Recomendar productos específicos según la consulta del cliente,
   indicando marca, categoría y, si aplica, precio.
 • Ofrecer promociones vigentes si existen (aunque en esta prueba
   inicial no buscaremos promociones; solo devolvemos productos).
 • Mantén un tono amable y conciso.

`.trim();
}

/**
 * buildUserChatPrompt:
 *   Recibe:
 *     - from: número de teléfono del cliente (string).
 *     - body: texto original que envió el cliente.
 *     - productListText: la lista de productos formateada
 *                        (o mensaje “no encontré…”).
 *     - promoText: cualquier texto adicional que quieras agregar al final
 *   Construye y devuelve un prompt (string) para enviarle a GPT.
 */
function buildUserChatPrompt({ from, body, productListText, promoText }) {
  return `
Cliente (${from}) escribió: "${body}"

Productos relevantes:
${productListText}

${promoText}
`.trim();
}

module.exports = {
  buildSystemChatPrompt,
  buildUserChatPrompt
};
