// src/core/services/searchProducts.js

/**
 * searchProducts:
 *   - Recibe el texto del usuario (body) y el objeto `repos`.
 *   - Llama a repos.pineProductoRepo.semanticSearch(...) para obtener
 *     hasta `topK` resultados semánticos (por defecto, 3).
 *   - Devuelve un string formateado con la lista de productos o un mensaje
 *     “no encontré productos…” si no hay matches.
 *
 * @param {string} body       El texto que envió el cliente.
 * @param {Object} repos      Debe contener al menos `pineProductoRepo`.
 * @param {number} [topK=3]   Cuántos resultados traer como máximo.
 * @returns {Promise<string>} Un bloque de texto (listas de “• nombre (Marca, Categoría)”)
 */
async function searchProducts(body, repos, topK = 3) {
    // 1) Si no existe el repositorio de Pinecone, retorna un mensaje de fallback
    if (!repos.pineProductoRepo || typeof repos.pineProductoRepo.semanticSearch !== 'function') {
        return 'Lo siento, aún no puedo buscar productos en este momento.';
    }

    // 2) Hacemos la búsqueda semántica
    const semResults = await repos.pineProductoRepo.semanticSearch(body, topK);

    // 3) Si no hay coincidencias
    if (!semResults || semResults.length === 0) {
        return 'No encontré productos relevantes para tu consulta.';
    }

    // 4) Construimos un texto con la lista
    //    Por ejemplo: “• Camiseta XYZ (Marca: Nike, Categoría: Polera) — score: 0.89”
    const lines = semResults.map(r => {
        const { producto, score } = r;
        return `• ${producto.nombre} (Marca: ${producto.marcaNombre}, Categoría: ${producto.categoriaNombre}) — score: ${score.toFixed(2)}`;
    });

    return lines.join('\n');
}

module.exports = { searchProducts };