// src/core/services/searchPromotions.js

/**
 * Busca promociones relevantes para la consulta del usuario
 * @param {string} body - Texto del usuario
 * @param {object} repos - Repositorios (debe incluir pinePromocionRepo)
 * @param {number} topK - Número máximo de resultados
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

            return `🎉 *${promocion.nombre}* - ${descuento} (Válida hasta ${promocion.fechaFin}) — score: ${score.toFixed(2)}`;
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