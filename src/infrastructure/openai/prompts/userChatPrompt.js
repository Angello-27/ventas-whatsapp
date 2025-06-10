// src/infrastructure/openai/prompts/userChatPrompt.js

/**
 * Mapea términos de búsqueda comunes a los nombres reales en tu catálogo
 * @param {string} text - Texto del usuario
 * @returns {string} - Texto con sinónimos expandidos
 */
function expandSearchTerms(text) {
  const synonymMap = {
    // Pantalones
    'jeans': 'pantalón jeans',
    'jean': 'pantalón jean',
    'vaqueros': 'pantalón vaquero',
    'mezclilla': 'pantalón mezclilla',
    'denim': 'pantalón denim',

    // Camisetas
    'playera': 'camiseta playera',
    'polera': 'camiseta polera',
    'remera': 'camiseta remera',
    'franela': 'camiseta franela',
    't-shirt': 'camiseta',
    'tshirt': 'camiseta',

    // Zapatos
    'tenis': 'zapatos tenis',
    'zapatillas': 'zapatos zapatillas',
    'sneakers': 'zapatos deportivos',

    // Chaquetas
    'chamarra': 'chaqueta chamarra',
    'campera': 'chaqueta campera',
    'casaca': 'chaqueta casaca',

    // Géneros específicos
    'niña': 'niños niña',
    'niño': 'niños niño',
    'bebe': 'bebé niños',
    'infantil': 'niños'
  };

  let expandedText = text.toLowerCase();

  // Aplicar sinónimos
  for (const [synonym, expansion] of Object.entries(synonymMap)) {
    const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
    expandedText = expandedText.replace(regex, expansion);
  }

  return expandedText;
}

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
  // Expandir términos de búsqueda para mejor matching
  const expandedQuery = expandSearchTerms(body);

  // Si el texto expandido es diferente, incluir ambos
  if (expandedQuery !== body.toLowerCase()) {
    return `Cliente (${from}) escribió: "${body}"

Términos de búsqueda expandidos: "${expandedQuery}"

Nota: El cliente puede usar términos coloquiales. Por ejemplo:
- "jeans" se refiere a pantalones
- "playera" se refiere a camisetas  
- "tenis" se refiere a zapatos deportivos`.trim();
  }

  return `Cliente (${from}) escribió: "${body}"`.trim();
}

module.exports = { buildUserChatPrompt };