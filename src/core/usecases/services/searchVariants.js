// src/core/services/searchVariants.js

/**
 * searchVariants:
 *   - Recibe el texto del usuario (body) y el objeto `repos`.
 *   - Llama a repos.pineVarianteRepo.semanticSearch(...) para obtener
 *     hasta `topK` resultados semánticos (por defecto, 3).
 *   - Devuelve un string formateado con la lista de variantes o un mensaje
 *     “no encontré variantes…” si no hay matches.
 *
 * @param {string} body       El texto que envió el cliente.
 * @param {Object} repos      Debe contener al menos `pineVarianteRepo`.
 * @param {number} [topK=3]   Cuántos resultados traer como máximo.
 * @returns {Promise<string>} Un bloque de texto (listas de “• SKU – Producto (Color, Talla) — Precio”)
 */
async function searchVariants(body, repos, topK = 3) {
    // 1) Si no existe el repositorio de Pinecone de variantes, fallback
    if (!repos.pineVarianteRepo || typeof repos.pineVarianteRepo.semanticSearch !== 'function') {
        return 'Lo siento, aún no puedo buscar variantes en este momento.';
    }

    // 2) Hacemos la búsqueda semántica
    const semResults = await repos.pineVarianteRepo.semanticSearch(body, topK);

    // 3) Si no hay coincidencias
    if (!semResults || semResults.length === 0) {
        return 'No encontré variantes relevantes para tu consulta.';
    }

    // 4) Construimos un texto con la lista de variantes
    //    Ejemplo de línea: “• SKU-051 – Camiseta Azul (Color: Azul, Talla: M) — Precio: 99.50”
    const lines = semResults.map(r => {
        const { variante, score } = r;
        const {
            sku,
            productoNombre,
            color,
            talla,
            precioVenta
        } = variante;
        return `• ${sku} – ${productoNombre} (Color: ${color}, Talla: ${talla}) — Precio: ${precioVenta.toFixed(2)} — score: ${score.toFixed(2)}`;
    });

    return lines.join('\n');
}

module.exports = { searchVariants };
