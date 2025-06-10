// src/core/services/searchPromotionProducts.js

/**
 * Búsqueda de productos dentro de promociones via Pinecone
 * @param {string} body     Texto de consulta del usuario
 * @param {object} repos    Debe incluir repos.pinePromocionProductoRepo
 * @param {number} topK     Máximo de resultados (por defecto 5)
 * @returns {Promise<{text: string, results: Array}>}
 */
async function searchPromotionProducts(body, repos, topK = 5) {
  if (!repos.pinePromocionProductoRepo || typeof repos.pinePromocionProductoRepo.semanticSearch !== 'function') {
    return {
      text: 'No hay productos en promoción disponibles en este momento.',
      results: []
    };
  }

  try {
    const semResults = await repos.pinePromocionProductoRepo.semanticSearch(body, topK);
    if (!semResults || semResults.length === 0) {
      return {
        text: 'No encontré productos en promoción para tu consulta.',
        results: []
      };
    }

    const lines = semResults.map(r => {
      const { promocionProducto, score } = r;
      const descuento = promocionProducto.tipoDescuento === 'Porcentaje'
        ? `${promocionProducto.valorDescuento}% OFF`
        : `$${promocionProducto.valorDescuento} de descuento`;
      return `🏷️ *${promocionProducto.productoNombre}* (${promocionProducto.marcaNombre}) - ${descuento} en promoción "${promocionProducto.promocionNombre}" — score: ${score.toFixed(2)}`;
    });

    return {
      text: lines.join('\n'),
      results: semResults
    };

  } catch (error) {
    console.error('Error en searchPromotionProducts:', error);
    return {
      text: 'Hubo un error consultando los productos en promoción.',
      results: []
    };
  }
}

module.exports = { searchPromotionProducts };