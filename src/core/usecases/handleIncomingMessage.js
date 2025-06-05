// src/core/usecases/handleIncomingMessage.js

const { buildSystemChatPrompt } = require('../../infrastructure/openai/prompts/baseChatPrompt');
const { buildUserChatPrompt } = require('../../infrastructure/openai/prompts/userChatPrompt');
const { searchProducts } = require('./services/searchProducts');
const { searchVariants } = require('./services/searchVariants');
const clothingTerms = require('../constants/clothingTerms');

/**
 * Verifica si algún término de targetTerms aparece en keywords (ambos en minúsculas).
 */
function containsTerm(keywords, targetTerms) {
  return keywords.some(kw => targetTerms.includes(kw.toLowerCase()));
}

/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp.
 *
 * @param {{ from: string, body: string }} data
 * @param {object} repos        – Debe contener: repos.pineProductoRepo y repos.pineVarianteRepo
 * @param {OpenAIClient} chatClient – Instancia de OpenAIClient (modelo chat)
 *
 * @returns {Promise<string>} – el texto que responderá Twilio al usuario.
 */
async function handleIncomingMessage({ from, body }, repos, chatClient) {

  // 3) Si menciona ropa, ejecutamos búsquedas semánticas
  const productListText = await searchProducts(body, repos, 3);
  const variantListText = await searchVariants(body, repos, 3);

  // 4) Construir los prompts: primero el de sistema (todas las reglas)
  const systemPrompt = buildSystemChatPrompt();

  // 5) Luego el prompt de usuario con el texto actual
  const userPrompt = buildUserChatPrompt({ from, body });

  // 6) Concatenar resultados de búsqueda de productos y variantes
  const combinedSearchText =
    `*Productos relevantes:*\n${productListText}\n\n` +
    `*Variantes relevantes:*\n${variantListText}`;

  // 7) Llamar a OpenAI para generar la respuesta final
  const reply = await chatClient.chat({
    systemPrompt,
    userMessage: userPrompt + '\n\n' + combinedSearchText
  });

  // 8) Devolver el texto que Twilio le enviará al cliente
  return reply;
}

module.exports = handleIncomingMessage;
