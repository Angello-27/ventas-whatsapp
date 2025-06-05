// src/core/usecases/handleIncomingMessage.js

const { buildSystemChatPrompt, buildUserChatPrompt } = require('../../infrastructure/openai/prompts/chatPrompts');
const { searchProducts } = require('./services/productSearch');
const { searchVariants } = require('./services/searchVariants');

/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp.
 *
 * @param {{ from: string, body: string }} data
 * @param {object} repos      – Debe contener: repos.pineProductoRepo y repos.pineVarianteRepo
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

  // 2a) Búsqueda semántica de productos
  const productListText = await searchProducts(body, repos, 3);

  // 2b) Búsqueda semántica de variantes
  const variantListText = await searchVariants(body, repos, 3);

  // 3) Definimos un texto estático de sugerencia/promoción (por ahora fijo)
  const promoText = 'Si deseas comprar, indícame el ID del producto o el SKU de la variante y la cantidad.';

  // 4) Construir los prompts
  const systemPrompt = buildSystemChatPrompt();
  const userPrompt = buildUserChatPrompt({
    from,
    body,
    productListText,
    variantListText,
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
