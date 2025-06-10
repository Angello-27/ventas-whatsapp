// src/core/services/searchVariants.js
async function searchVariants(body, repos, topK = 3) {
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
        return `• ${sku} – ${productoNombre} (Color: ${color}, Talla: ${talla}) — Precio: ${precioVenta} — score: ${score.toFixed(2)}`;
    });

    return {
        text: lines.join('\n'),
        results: semResults  // ✅ NUEVO: Retornar también los objetos
    };
}

module.exports = { searchVariants };