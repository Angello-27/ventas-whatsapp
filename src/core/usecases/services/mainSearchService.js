// src/core/services/mainSearchService.js

const QueryEnhancementService = require('./queryEnhancementService');

class MainSearchService {
    constructor(repos) {
        this.repos = repos;
        this.queryEnhancer = new QueryEnhancementService();
    }

    /**
     * Realiza búsqueda normal con query mejorada
     * @param {string} originalQuery - Consulta original
     * @returns {Promise<string>}
     */
    async performSearch(originalQuery) {
        try {
            console.log('🔍 Iniciando búsqueda principal para:', originalQuery);

            // Mejorar la consulta
            const enhancedQuery = this.queryEnhancer.enhanceQuery(originalQuery);

            // Realizar búsquedas principales
            const results = await this._executeSearches(enhancedQuery);

            // Si no hay resultados, intentar con consulta original
            if (this._isEmpty(results) && enhancedQuery !== originalQuery) {
                console.log('⚠️ Sin resultados con query mejorada, intentando original...');
                const originalResults = await this._executeSearches(originalQuery);
                return this._formatResults(originalResults, originalQuery);
            }

            return this._formatResults(results, enhancedQuery);

        } catch (error) {
            console.error('Error en búsqueda principal:', error);
            return 'Hubo un error realizando la búsqueda de productos.';
        }
    }

    /**
     * Ejecuta todas las búsquedas necesarias
     * @param {string} query - Consulta a ejecutar
     * @returns {Promise<object>}
     */
    async _executeSearches(query) {
        const { searchProducts } = require('./searchProducts');
        const { searchVariants } = require('./searchVariants');

        const results = {
            products: await searchProducts(query, this.repos, 3),
            variants: await searchVariants(query, this.repos, 3),
            promotions: null,
            promotionProducts: null
        };

        // Intentar búsquedas de promociones si están disponibles
        try {
            const { searchPromotions } = require('./searchPromotions');
            const { searchPromotionProducts } = require('./searchPromotionProducts');

            results.promotions = await searchPromotions(query, this.repos, 2);
            results.promotionProducts = await searchPromotionProducts(query, this.repos, 3);
        } catch (promError) {
            console.warn('⚠️ Servicios de promociones no disponibles:', promError.message);
        }

        return results;
    }

    /**
     * Verifica si los resultados están vacíos
     * @param {object} results - Resultados de búsqueda
     * @returns {boolean}
     */
    _isEmpty(results) {
        const hasProducts = results.products?.results?.length > 0;
        const hasVariants = results.variants?.results?.length > 0;
        return !hasProducts && !hasVariants;
    }

    /**
     * Formatea los resultados para presentación
     * @param {object} results - Resultados de búsqueda
     * @param {string} query - Consulta utilizada
     * @returns {string}
     */
    _formatResults(results, query) {
        const productText = typeof results.products === 'object' ? results.products.text : results.products;
        const variantText = typeof results.variants === 'object' ? results.variants.text : results.variants;

        let searchText = `*Productos relevantes:*\n${productText}\n\n*Variantes relevantes:*\n${variantText}`;

        // Agregar promociones si hay resultados
        if (results.promotions?.results?.length > 0) {
            searchText += `\n\n*🎉 Promociones activas:*\n${results.promotions.text}`;
        }

        if (results.promotionProducts?.results?.length > 0) {
            searchText += `\n\n*🏷️ Productos en promoción:*\n${results.promotionProducts.text}`;
        }

        return searchText;
    }

    /**
     * Crea contexto basado en los resultados de búsqueda
     * @param {string} query - Consulta original
     * @returns {Promise<object>}
     */
    async createSearchContext(query) {
        try {
            const enhancedQuery = this.queryEnhancer.enhanceQuery(query);
            const results = await this._executeSearches(enhancedQuery);

            let allItems = [];

            if (results.products?.results) {
                allItems.push(...results.products.results.map(r => ({ type: 'product', ...r })));
            }

            if (results.variants?.results) {
                allItems.push(...results.variants.results.map(r => ({ type: 'variant', ...r })));
            }

            const context = {
                lastType: 'search',
                lastQuery: query,
                enhancedQuery: enhancedQuery,
                timestamp: new Date().toISOString(),
                lastItems: allItems,
                keyTerms: this.queryEnhancer.extractKeyTerms(query)
            };

            console.log('✅ Contexto de búsqueda creado:', {
                query: context.lastQuery,
                items: context.lastItems.length,
                terms: Object.keys(context.keyTerms)
            });

            return context;

        } catch (error) {
            console.error('Error creando contexto:', error);
            return {
                lastType: 'search',
                lastQuery: query,
                timestamp: new Date().toISOString(),
                lastItems: []
            };
        }
    }
}

module.exports = MainSearchService;