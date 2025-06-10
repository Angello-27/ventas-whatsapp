// src/core/services/contextualPromotionSearch.js

const { searchPromotions }        = require('./searchPromotions');
const { searchPromotionProducts } = require('./searchPromotionProducts');

/**
 * Busca promociones específicas para los productos en contexto
 * @param {Array}  lastItems - Items del contexto anterior
 * @param {object} repos     - Debe incluir pinePromocionRepo y pinePromocionProductoRepo
 * @returns {Promise<{text: string, results: Array}>}
 */
async function findPromotionsForContext(lastItems, repos) {
  console.log('🎟️ ContextualPromotionSearch: items en contexto =', lastItems.length);
  if (!lastItems || lastItems.length === 0) {
    return {
      text: 'No tengo productos en contexto para buscar promociones.',
      results: []
    };
  }

  // 1) Extraer nombres únicos de productos
  const productNames = [...new Set(
    lastItems
      .map(i => i.producto?.nombre || i.variante?.productoNombre || '')
      .filter(Boolean)
  )];
  console.log('   → Productos para promocionar:', productNames.join(', '));

  if (productNames.length === 0) {
    return {
      text: 'No puedo determinar productos para buscar promociones.',
      results: []
    };
  }

  const query = productNames.join(' ');
  console.log(`🔍 Buscando promociones para query="${query}"`);

  // 2) Buscar promociones generales
  const promoRes = await searchPromotions(query, repos, 5);
  if (!promoRes.results.length) {
    return {
      text: `No encontré promociones activas para: ${productNames.slice(0,2).join(', ')}.`,
      results: []
    };
  }

  let text = `*🎉 Promociones encontradas para "${productNames.slice(0,2).join(', ')}":*\n${promoRes.text}`;

  // 3) Obtener productos de la primera promoción
  const firstPromo = promoRes.results[0].promocion;
  const promoId    = firstPromo.promocionId;
  console.log(`   → Obteniendo productos de la promoción ID=${promoId}`);

  const prodInPromoRes = await searchPromotionProducts(promoId.toString(), repos, 5);
  if (prodInPromoRes.results.length) {
    text += `\n\n*🏷️ Productos en la promoción "${firstPromo.Titulo || firstPromo.nombre}":*\n${prodInPromoRes.text}`;
  } else {
    console.log('   → No hay productos en promoción para ese ID');
  }

  // 4) Retornar también los resultados de promociones generales
  return {
    text,
    results: promoRes.results
  };
}

module.exports = { findPromotionsForContext };
