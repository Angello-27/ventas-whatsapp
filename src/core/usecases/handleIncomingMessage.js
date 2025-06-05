// src/core/usecases/handleIncomingMessage.js

const { buildSystemChatPrompt, buildUserChatPrompt } = require('../../infrastructure/openai/prompts/chatPrompts');
const { searchProducts } = require('./services/productSearch');

/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp.
 *
 * @param {{ from: string, body: string }} data
 * @param {object} repos      – Debe contener al menos: repos.pineProductoRepo
 * @param {OpenAIClient} chatClient – Instancia de OpenAIClient (modelo chat)
 *
 * @returns {Promise<string>} – el texto que responderá Twilio al usuario.
 */
async function handleIncomingMessage(
  { from, body },
  repos,
  chatClient
) {
  // 1) Extraer keywords (puedes usarlo si lo necesitas más adelante)
  const keywords = body.match(/\w+/g) || [];

  // 2) Hacer búsqueda semántica de productos
  //    (el utilitario searchProducts devolverá un string ya formateado)
  const productListText = await searchProducts(body, repos, 3);

  // 3) Definimos un texto estático de sugerencia/promoción (por ahora fijo)
  const promoText = 'Si deseas comprar, indícame el ID del producto y la cantidad.';

  // 4) Construir los prompts
  const systemPrompt = buildSystemChatPrompt();
  const userPrompt = buildUserChatPrompt({
    from,
    body,
    productListText,
    promoText
  });

  // 5) Llamar a OpenAI para generar la respuesta
  const reply = await chatClient.chat({
    systemPrompt,
    userMessage: userPrompt
  });

  // 6) Devolver el texto que Twilio le enviará al cliente
  return reply;
}

module.exports = handleIncomingMessage;
