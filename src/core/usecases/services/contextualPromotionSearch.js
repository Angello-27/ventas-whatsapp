// src/core/services/contextualPromotionSearch.js

/**
 * Busca promociones específicas para los productos en contexto
 * @param {Array} lastItems - Items del contexto anterior
 * @param {object} repos 
 * @returns {Promise<string>}
 */
async function findPromotionsForContext(lastItems, repos) {
    if (!lastItems || lastItems.length === 0) {
        return 'No tengo productos en contexto para buscar promociones.';
    }

    try {
        // Extraer nombres de productos del contexto
        const productNames = lastItems.map(item => {
            if (item.producto) return item.producto.nombre;
            if (item.variante) return item.variante.productoNombre;
            return '';
        }).filter(name => name);

        if (productNames.length === 0) {
            return 'No puedo determinar productos para buscar promociones.';
        }

        // Buscar promociones para estos productos
        const query = productNames.join(' ');
        const promotionSearch = await searchPromotionProducts(query, repos, 5);

        if (promotionSearch.results.length === 0) {
            return `No encontré promociones activas para los productos consultados: ${productNames.slice(0, 2).join(', ')}.`;
        }

        return `*🎉 Promociones para los productos que consultaste:*\n${promotionSearch.text}`;

    } catch (error) {
        console.error('Error buscando promociones para contexto:', error);
        return 'Hubo un error consultando promociones para estos productos.';
    }
}

module.exports = { findPromotionsForContext };