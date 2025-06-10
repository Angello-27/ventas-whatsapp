// src/core/services/searchProducts.js
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
        results: semResults  // ✅ NUEVO: Retornar también los objetos
    };
}

module.exports = { searchProducts };