// src/core/usecases/handleIncomingMessage.js

const { buildSystemChatPrompt } = require('../../infrastructure/openai/prompts/baseChatPrompt');
const { buildUserChatPrompt } = require('../../infrastructure/openai/prompts/userChatPrompt');
const { searchProducts } = require('./services/searchProducts');
const { searchVariants } = require('./services/searchVariants');
const { searchPromotions } = require('./services/searchPromotions');
const { searchPromotionProducts, getProductsInPromotion } = require('./services/searchPromotionProducts,js');
const { findPromotionsForContext } = require('./services/contextualPromotionSearch');


/**
 * Detecta si el mensaje es un follow-up contextual
 * @param {string} body 
 * @returns {object} { isFollowUp: boolean, type: string, query: string }
 */
function detectFollowUp(body) {
  const text = body.trim().toLowerCase();

  // Patrones de follow-up para colores
  const colorPatterns = [
    'color', 'colores', 'que colores', 'qué colores',
    'de que color', 'de qué color', 'tonos', 'matices'
  ];

  // Patrones de follow-up para tallas
  const sizePatterns = [
    'talla', 'tallas', 'que tallas', 'qué tallas',
    'tamaño', 'tamaños', 'medida', 'medidas', 'size'
  ];

  // Patrones para precios
  const pricePatterns = [
    'precio', 'precios', 'cuesta', 'vale', 'valor',
    'cuanto', 'cuánto', 'cost'
  ];

  // Patrones para marcas específicas (expandir según tu catálogo)
  const brandPatterns = [
    'adidas', 'nike', 'puma', 'zara', 'h&m', 'gap',
    'también', 'además', 'otra marca', 'otras marcas'
  ];

  // Patrones para materiales
  const materialPatterns = [
    'material', 'materiales', 'tela', 'tejido', 'algodón',
    'poliéster', 'lycra', 'spandex'
  ];

  // NUEVOS patrones para promociones
  const promotionPatterns = [
    'promocion', 'promociones', 'oferta', 'ofertas', 'descuento', 'descuentos',
    'rebaja', 'rebajas', 'promo', 'promos', 'especial', 'liquidacion'
  ];

  const promotionDetailsPatterns = [
    'productos en promocion', 'que productos', 'que tiene la promocion',
    'detalles de la promocion', 'productos de la oferta'
  ];

  if (colorPatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'colors', query: text };
  }

  if (sizePatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'sizes', query: text };
  }

  if (pricePatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'prices', query: text };
  }

  if (materialPatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'materials', query: text };
  }

  if (brandPatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'extend', query: text };
  }

  if (promotionPatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'promotions', query: text };
  }

  if (promotionDetailsPatterns.some(pattern => text.includes(pattern))) {
    return { isFollowUp: true, type: 'promotion_details', query: text };
  }

  return { isFollowUp: false, type: null, query: text };
}

/**
 * Lista colores únicos de los productos en el contexto
 * @param {Array} lastItems - Items del contexto anterior
 * @param {object} repos 
 * @returns {Promise<string>}
 */
async function listColorsFromContext(lastItems, repos) {
  if (!lastItems || lastItems.length === 0) {
    return 'No tengo productos en contexto para mostrar colores.';
  }

  try {
    // Obtener el primer producto para buscar sus variantes
    const firstProduct = lastItems[0];
    const productoId = firstProduct.producto?.productoId || firstProduct.variante?.productoId;

    if (!productoId) {
      return 'No puedo determinar el producto para mostrar colores.';
    }

    // Buscar variantes de este producto específico
    const query = `producto ${firstProduct.producto?.nombre || firstProduct.variante?.productoNombre}`;
    const variants = await repos.pineVarianteRepo.semanticSearch(query, 15);

    if (!variants || variants.length === 0) {
      return 'No encontré variantes de color para este producto.';
    }

    // Extraer colores únicos
    const colores = [...new Set(variants.map(v => v.variante.color))].filter(c => c);

    if (colores.length === 0) {
      return 'No hay información de colores disponible para este producto.';
    }

    return `*Colores disponibles para ${firstProduct.producto?.nombre || firstProduct.variante?.productoNombre}:*\n${colores.map(color => `• ${color}`).join('\n')}`;

  } catch (error) {
    console.error('Error listando colores:', error);
    return 'Hubo un error consultando los colores disponibles.';
  }
}

/**
 * Lista tallas únicas de los productos en el contexto
 * @param {Array} lastItems - Items del contexto anterior
 * @param {object} repos 
 * @returns {Promise<string>}
 */
async function listSizesFromContext(lastItems, repos) {
  if (!lastItems || lastItems.length === 0) {
    return 'No tengo productos en contexto para mostrar tallas.';
  }

  try {
    const firstProduct = lastItems[0];
    const query = `producto ${firstProduct.producto?.nombre || firstProduct.variante?.productoNombre}`;
    const variants = await repos.pineVarianteRepo.semanticSearch(query, 15);

    if (!variants || variants.length === 0) {
      return 'No encontré variantes de talla para este producto.';
    }

    // Extraer tallas únicas
    const tallas = [...new Set(variants.map(v => v.variante.talla))].filter(t => t);

    if (tallas.length === 0) {
      return 'No hay información de tallas disponible para este producto.';
    }

    return `*Tallas disponibles para ${firstProduct.producto?.nombre || firstProduct.variante?.productoNombre}:*\n${tallas.map(talla => `• ${talla}`).join('\n')}`;

  } catch (error) {
    console.error('Error listando tallas:', error);
    return 'Hubo un error consultando las tallas disponibles.';
  }
}

/**
 * Muestra precios de los productos en el contexto
 * @param {Array} lastItems - Items del contexto anterior
 * @returns {string}
 */
function listPricesFromContext(lastItems) {
  if (!lastItems || lastItems.length === 0) {
    return 'No tengo productos en contexto para mostrar precios.';
  }

  const lines = lastItems.map((item, index) => {
    if (item.producto) {
      return `${index + 1}. *${item.producto.nombre}* - Consultar variantes para precios específicos`;
    } else if (item.variante) {
      return `${index + 1}. *${item.variante.productoNombre}* (${item.variante.color}, ${item.variante.talla}) - *$${item.variante.precioVenta}*`;
    }
    return `${index + 1}. Producto sin información de precio`;
  });

  return `*Precios de productos consultados:*\n${lines.join('\n')}`;
}

/**
 * Extiende la búsqueda actual con nueva marca/categoría
 * @param {string} newQuery 
 * @param {Array} lastItems 
 * @param {object} repos 
 * @returns {Promise<string>}
 */
async function extendSearch(newQuery, lastItems, repos) {
  try {
    // Realizar nueva búsqueda
    const newProductText = await searchProducts(newQuery, repos, 3);
    const newVariantText = await searchVariants(newQuery, repos, 3);

    // Formatear productos previos
    let previousText = '';
    if (lastItems && lastItems.length > 0) {
      const prevLines = lastItems.slice(0, 3).map(item => {
        if (item.producto) {
          return `• ${item.producto.nombre} (${item.producto.marcaNombre}, ${item.producto.categoriaNombre})`;
        } else if (item.variante) {
          return `• ${item.variante.productoNombre} (${item.variante.color}, ${item.variante.talla}) - $${item.variante.precioVenta}`;
        }
        return '• Producto consultado anteriormente';
      });
      previousText = `*Productos consultados anteriormente:*\n${prevLines.join('\n')}\n\n`;
    }

    return `${previousText}*Nuevos resultados:*\n${newProductText}\n\n*Nuevas variantes:*\n${newVariantText}`;

  } catch (error) {
    console.error('Error extendiendo búsqueda:', error);
    return 'Hubo un error al buscar nuevos productos.';
  }
}

/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp con contexto conversacional.
 *
 * @param {{ from: string, body: string }} data
 * @param {object} repos        – Debe contener: repos.pineProductoRepo, repos.pineVarianteRepo, repos.chatRepo
 * @param {OpenAIClient} chatClient – Instancia de OpenAIClient (modelo chat)
 * @param {Sesion} sesion       – Entidad de sesión con contexto
 *
 * @returns {Promise<string>} – el texto que responderá Twilio al usuario.
 */
async function handleIncomingMessage({ from, body }, repos, chatClient, sesion) {
  console.log(`🎯 Procesando mensaje de ${from}: "${body}"`);

  try {
    // 1) Obtener contexto de la sesión
    const context = sesion.getContexto ? sesion.getContexto() : null;
    console.log(`🧠 Contexto actual:`, context ? {
      tipo: context.lastType,
      query: context.lastQuery,
      items: context.lastItems?.length || 0
    } : 'Sin contexto');

    // 2) Detectar si es un follow-up
    const followUp = detectFollowUp(body);
    console.log(`🔍 Follow-up detectado:`, followUp);

    let combinedSearchText = '';
    let newContext = null;

    // 3) Procesar según el tipo de mensaje
    if (followUp.isFollowUp && context?.lastItems && context.lastItems.length > 0) {
      console.log(`♻️ Procesando follow-up de tipo: ${followUp.type}`);

      switch (followUp.type) {
        case 'colors':
          combinedSearchText = await listColorsFromContext(context.lastItems, repos);
          newContext = context; // Mantener el mismo contexto
          break;

        case 'sizes':
          combinedSearchText = await listSizesFromContext(context.lastItems, repos);
          newContext = context; // Mantener el mismo contexto
          break;

        case 'prices':
          combinedSearchText = listPricesFromContext(context.lastItems);
          newContext = context; // Mantener el mismo contexto
          break;

        case 'materials':
          // Similar a colores pero para materiales
          combinedSearchText = 'Consultando materiales disponibles...';
          newContext = context;
          break;

        case 'extend':
          combinedSearchText = await extendSearch(body, context.lastItems, repos);
          // Para extender, mantenemos el contexto por ahora (podrías actualizarlo con nuevos items)
          newContext = context;
          break;

        case 'promotions':
          combinedSearchText = await findPromotionsForContext(context.lastItems, repos);
          newContext = context;
          break;

        case 'promotion_details':
          // Si hay una promoción específica en el contexto, mostrar sus productos
          if (context.lastPromotionId) {
            combinedSearchText = await getProductsInPromotion(context.lastPromotionId, repos);
          } else {
            combinedSearchText = 'Por favor selecciona una promoción específica para ver sus productos.';
          }
          newContext = context;
          break;

        default:
          // Si no reconocemos el follow-up, hacer búsqueda normal
          console.log(`⚠️ Tipo de follow-up no reconocido: ${followUp.type}`);
          combinedSearchText = await performNormalSearch(body, repos);
          newContext = await createNewContext(body, repos);
      }

    } else {
      // 4) Búsqueda normal (como tu código original)
      console.log(`🔍 Realizando búsqueda normal`);
      combinedSearchText = await performNormalSearch(body, repos);
      newContext = await createNewContext(body, repos);
    }

    // 5) Guardar nuevo contexto en la sesión
    if (newContext) {
      console.log(`💾 Guardando nuevo contexto:`, {
        tipo: newContext.lastType,
        items: newContext.lastItems?.length || 0
      });

      sesion.setContexto(newContext);
      await repos.chatRepo.updateSessionContext(sesion.sesionId, newContext);
    }

    // 6) Construir prompts y generar respuesta
    const systemPrompt = buildSystemChatPrompt();
    const userPrompt = buildUserChatPrompt({ from, body });

    console.log(`🤖 Generando respuesta con OpenAI...`);
    const reply = await chatClient.chat({
      systemPrompt,
      userMessage: userPrompt + '\n\n' + combinedSearchText
    });

    console.log(`✅ Respuesta generada: "${reply.substring(0, 100)}..."`);
    return reply;

  } catch (error) {
    console.error(`❌ Error en handleIncomingMessage:`, error);
    return 'Lo siento, hubo un problema procesando tu consulta. ¿Podrías intentar de nuevo?';
  }
}

/**
 * Realiza búsqueda normal de productos y variantes
 * @param {string} body 
 * @param {object} repos 
 * @returns {Promise<string>}
 */
async function performNormalSearch(body, repos) {
  const productSearch = await searchProducts(body, repos, 3);
  const variantSearch = await searchVariants(body, repos, 3);
  const promotionSearch = await searchPromotions(body, repos, 2);
  const promotionProductSearch = await searchPromotionProducts(body, repos, 3);

  let searchText = `*Productos relevantes:*\n${productSearch.text}\n\n*Variantes relevantes:*\n${variantSearch.text}`;

  // Agregar promociones si hay resultados
  if (promotionSearch.results.length > 0) {
    searchText += `\n\n*🎉 Promociones activas:*\n${promotionSearch.text}`;
  }

  if (promotionProductSearch.results.length > 0) {
    searchText += `\n\n*🏷️ Productos en promoción:*\n${promotionProductSearch.text}`;
  }

  return searchText;
}

/**
 * Crea nuevo contexto basado en la búsqueda actual
 * @param {string} body 
 * @param {object} repos 
 * @returns {Promise<object>}
 */
async function createNewContext(body, repos) {
  try {
    // Realizar búsquedas para obtener objetos
    const productSearch = await searchProducts(body, repos, 3);
    const variantSearch = await searchVariants(body, repos, 3);

    // Combinar resultados para el contexto
    const allItems = [
      ...productSearch.results.map(r => ({ type: 'product', ...r })),
      ...variantSearch.results.map(r => ({ type: 'variant', ...r }))
    ];

    return {
      lastType: 'search',
      lastQuery: body,
      timestamp: new Date().toISOString(),
      lastItems: allItems  // ✅ Ahora con objetos reales
    };
  } catch (error) {
    console.error('Error creando contexto:', error);
    return {
      lastType: 'search',
      lastQuery: body,
      timestamp: new Date().toISOString(),
      lastItems: []
    };
  }
}

module.exports = handleIncomingMessage;