// src/core/services/searchPromotionProducts.js

/**
 * Busca productos específicos dentro de promociones
 * @param {string} body - Texto del usuario
 * @param {object} repos - Repositorios (debe incluir pinePromocionProductoRepo)
 * @param {number} topK - Número máximo de resultados
 * @returns {Promise<{text: string, results: Array}>}
 */
async function searchPromotionProducts(body, repos, topK = 5) {
    if (!repos.pinePromocionProductoRepo || typeof repos.pinePromocionProductoRepo.semanticSearch !== 'function') {
        return {
            text: 'No hay productos en promoción disponibles.',
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
                : `$${promocionProducto.valorDescuento} DESC`;

            return `🏷️ *${promocionProducto.productoNombre}* (${promocionProducto.marcaNombre}) - ${descuento} en promoción "${promocionProducto.promocionNombre}" — score: ${score.toFixed(2)}`;
        });

        return {
            text: lines.join('\n'),
            results: semResults
        };

    } catch (error) {
        console.error('Error en searchPromotionProducts:', error);
        return {
            text: 'Hubo un error consultando productos en promoción.',
            results: []
        };
    }
}

/**
 * Obtiene los productos de una promoción específica
 * @param {number} promocionId - ID de la promoción
 * @param {object} repos - Repositorios
 * @returns {Promise<string>}
 */
async function getProductsInPromotion(promocionId, repos) {
    try {
        // Buscar productos de esta promoción específica
        const query = `promocion id ${promocionId}`;
        const promotionProducts = await repos.pinePromocionProductoRepo.semanticSearch(query, 10);

        if (!promotionProducts || promotionProducts.length === 0) {
            return 'No encontré productos en esta promoción.';
        }

        const lines = promotionProducts.map((r, index) => {
            const { promocionProducto } = r;
            const descuento = promocionProducto.tipoDescuento === 'Porcentaje'
                ? `${promocionProducto.valorDescuento}% OFF`
                : `$${promocionProducto.valorDescuento} DESC`;

            return `${index + 1}. *${promocionProducto.productoNombre}* (${promocionProducto.marcaNombre}) - ${descuento}`;
        });

        return `*Productos en esta promoción:*\n${lines.join('\n')}`;

    } catch (error) {
        console.error('Error obteniendo productos de promoción:', error);
        return 'Hubo un error consultando los productos de esta promoción.';
    }
}

module.exports = { searchPromotionProducts, getProductsInPromotion };