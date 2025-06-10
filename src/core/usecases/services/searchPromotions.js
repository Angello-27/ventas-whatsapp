
// src/core/services/searchPromotions.js

/**
 * Búsqueda de promociones relevantes via Pinecone
 * @param {string} body    Texto de consulta del usuario
 * @param {object} repos   Debe incluir repos.pinePromocionRepo
 * @param {number} topK    Máximo de resultados a devolver (por defecto 3)
 * @returns {Promise<{text: string, results: Array}>}
 */
async function searchPromotions(body, repos, topK = 3) {
  if (!repos.pinePromocionRepo || typeof repos.pinePromocionRepo.semanticSearch !== 'function') {
    return {
      text: 'No hay promociones disponibles en este momento.',
      results: []
    };
  }

  try {
    const semResults = await repos.pinePromocionRepo.semanticSearch(body, topK);
    if (!semResults || semResults.length === 0) {
      return {
        text: 'No encontré promociones activas para tu consulta.',
        results: []
      };
    }

    const lines = semResults.map(r => {
      const { promocion, score } = r;
      const descuento = promocion.tipoDescuento === 'Porcentaje'
        ? `${promocion.valorDescuento}% OFF`
        : `$${promocion.valorDescuento} de descuento`;
      return `🎉 *${promocion.Titulo || promocion.nombre}* - ${descuento} (Válida hasta ${promocion.FechaFin || promocion.fechaFin}) — score: ${score.toFixed(2)}`;
    });

    return {
      text: lines.join('\n'),
      results: semResults
    };
  } catch (error) {
    console.error('Error en searchPromotions:', error);
    return {
      text: 'Hubo un error consultando las promociones.',
      results: []
    };
  }
}

module.exports = { searchPromotions };