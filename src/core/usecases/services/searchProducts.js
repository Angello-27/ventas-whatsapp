// src/core/services/searchProducts.js

/**
 * Búsqueda semántica de productos via Pinecone
 * @param {string} body    Texto de consulta del usuario
 * @param {object} repos   Debe incluir repos.pineProductoRepo
 * @param {number} topK    Máximo de resultados a devolver (por defecto 3)
 * @returns {Promise<{text: string, results: Array}>}
 */
async function searchProducts(body, repos, topK = 3) {
  if (!repos.pineProductoRepo || typeof repos.pineProductoRepo.semanticSearch !== 'function') {
    return {
      text: 'Lo siento, aún no puedo buscar productos en este momento.',
      results: []
    };
  }

  const semResults = await repos.pineProductoRepo.semanticSearch(body, topK);
  if (!semResults || semResults.length === 0) {
    return {
      text: 'No encontré productos relevantes para tu consulta.',
      results: []
    };
  }

  const lines = semResults.map(r => {
    const { producto, score } = r;
    return `• ${producto.nombre} (Marca: ${producto.marcaNombre}, Categoría: ${producto.categoriaNombre}) — score: ${score.toFixed(2)}`;
  });

  return {
    text: lines.join('\n'),
    results: semResults
  };
}

module.exports = { searchProducts };