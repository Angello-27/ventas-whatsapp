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
 * @param {string} convoHistory  – Breve resumen de la conversación previa (puede estar vacío)
 *
 * @returns {Promise<string>} – el texto que responderá Twilio al usuario.
 */
async function handleIncomingMessage(
  { from, body },
  repos,
  chatClient,
  convoHistory = ''
) {
  // 1) Extraer “keywords” rudimentarias (solo palabras sin símbolos),
  //    transformándolas a minúsculas para la comparación.
  let rawWords = body.match(/\w+/g) || [];
  rawWords = rawWords.map(w => w.toLowerCase());

  // 2) Si no encuentra en rawWords ningún término de ropa, informamos:
  if (!containsTerm(rawWords, clothingTerms)) {
    return (
      'Lo siento, en *RopaExpress* solo vendemos prendas de vestir.\n' +
      'En la próxima temporada podríamos incorporar otros artículos, ' +
      'pero por ahora tenemos disponibles las siguientes categorías:\n\n' +
      '*Categorías:* Hombre, Mujer, Niños, Unisex\n' +
      '*Marcas disponibles:* Nike, Adidas, Puma, Reebok\n\n' +
      '¿Te interesa algo de ropa?'
    );
  }

  // 3) Si menciona ropa, ejecutamos búsquedas semánticas
  const productListText = await searchProducts(body, repos, 3);
  const variantListText = await searchVariants(body, repos, 3);

  // 4) Construir los prompts: primero el de sistema (todas las reglas)
  const systemPrompt = buildSystemChatPrompt();

  // 5) Luego el prompt de usuario con el texto actual + breve historial resumido
  const userPrompt = buildUserChatPrompt({
    from,
    body,
    history: convoHistory
  });

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
