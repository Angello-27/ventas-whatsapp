// src/core/services/searchProductVariants.js

/**
 * Búsqueda semántica de variantes de producto via Pinecone
 * @param {string} body    Texto de consulta del usuario
 * @param {object} repos   Debe incluir repos.pineVarianteRepo
 * @param {number} topK    Máximo de resultados a devolver (por defecto 3)
 * @returns {Promise<{text: string, results: Array}>}
 */
async function searchProductVariants(body, repos, topK = 3) {
  if (!repos.pineVarianteRepo || typeof repos.pineVarianteRepo.semanticSearch !== 'function') {
    return {
      text: 'Lo siento, aún no puedo buscar variantes en este momento.',
      results: []
    };
  }

  const semResults = await repos.pineVarianteRepo.semanticSearch(body, topK);
  if (!semResults || semResults.length === 0) {
    return {
      text: 'No encontré variantes relevantes para tu consulta.',
      results: []
    };
  }

  const lines = semResults.map(r => {
    const { variante, score } = r;
    const { sku, productoNombre, color, talla, precioVenta } = variante;

    // ✅ FIX: Convertir precioVenta a número antes de usar toFixed
    const precio = typeof precioVenta === 'string' ? parseFloat(precioVenta) : precioVenta;
    const precioFormateado = isNaN(precio) ? 'N/A' : precio.toFixed(2);

    return `• ${sku} – ${productoNombre} (Color: ${color}, Talla: ${talla}) — Precio: $${precioFormateado} — score: ${score.toFixed(2)}`;
  });

  return {
    text: lines.join('\n'),
    results: semResults
  };
}

module.exports = { searchProductVariants };