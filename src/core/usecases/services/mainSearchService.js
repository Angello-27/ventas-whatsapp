// src/core/services/mainSearchService.js

const QueryEnhancementService = require('./queryEnhancementService');
const { searchProducts } = require('./searchProducts');
const { searchProductVariants } = require('./searchProductVariants');
// Opcional: incluir servicios de promoción
const { searchPromotions } = require('./searchPromotions');
const { searchPromotionProducts } = require('./searchPromotionProducts');

class MainSearchService {
  constructor(repos) {
    this.repos = repos;
    this.queryEnhancer = new QueryEnhancementService();
  }

  /**
   * Realiza búsqueda normal con query mejorada y devuelve texto + lista de items para contexto
   * @param {string} originalQuery - Consulta original del usuario
   * @returns {Promise<{ text: string, items: Array }>} - Texto formateado y array de items
   */
  async performSearch(originalQuery) {
    console.log('🔍 Iniciando búsqueda principal para:', originalQuery);

    // 1) Mejorar la consulta
    const enhancedQuery = this.queryEnhancer.enhanceQuery(originalQuery);
    if (enhancedQuery !== originalQuery) {
      console.log(`🔄 Query mejorada: "${originalQuery}" → "${enhancedQuery}"`);
    }

    // 2) Ejecutar búsquedas principales
    let results = await this._executeSearches(enhancedQuery);

    // 3) Si no hay resultados, reintentar con la query original
    if (this._isEmpty(results) && enhancedQuery !== originalQuery) {
      console.log('⚠️ Sin resultados con query mejorada, intentando con la original...');
      results = await this._executeSearches(originalQuery);
    }

    // 4) Formatear texto de resultados
    const text = this._formatResults(results);

    // 5) Construir array de items para contexto
    const items = [];
    if (results.products?.results) {
      items.push(...results.products.results.map(r => ({ type: 'product',  ...r })));
    }
    if (results.variants?.results) {
      items.push(...results.variants.results.map(r => ({ type: 'variant',  ...r })));
    }
    if (results.promotions?.results) {
      items.push(...results.promotions.results.map(r => ({ type: 'promotion', ...r })));
    }
    if (results.promotionProducts?.results) {
      items.push(...results.promotionProducts.results.map(r => ({ type: 'promoProduct', ...r })));
    }

    console.log(`✅ Búsqueda completada: ${items.length} items`);
    return { text, items };
  }

  /**
   * Ejecuta las búsquedas de productos, variantes y promociones
   * @param {string} query
   * @returns {Promise<object>}
   */
  async _executeSearches(query) {
    const results = {
      products: await searchProducts(query, this.repos, 3),
      variants: await searchProductVariants(query, this.repos, 3),
      promotions: null,
      promotionProducts: null
    };

    // Buscar promociones si está disponible
    try {
      results.promotions = await searchPromotions(query, this.repos, 2);
      results.promotionProducts = await searchPromotionProducts(query, this.repos, 3);
    } catch (err) {
      console.warn('⚠️ Servicios de promociones no disponibles:', err.message);
    }

    return results;
  }

  /**
   * Comprueba si no hay items en productos ni variantes
   * @param {object} results
   */
  _isEmpty(results) {
    const hasProducts = !!results.products?.results?.length;
    const hasVariants = !!results.variants?.results?.length;
    return !hasProducts && !hasVariants;
  }

  /**
   * Formatea los resultados en un bloque de texto para WhatsApp
   * @param {object} results
   */
  _formatResults(results) {
    const prodText = typeof results.products === 'object'
      ? results.products.text
      : results.products;
    const varText = typeof results.variants === 'object'
      ? results.variants.text
      : results.variants;

    let searchText = `*Productos relevantes:*
${prodText}

*Variantes relevantes:*
${varText}`;

    if (results.promotions?.text) {
      searchText += `

*🎉 Promociones activas:*
${results.promotions.text}`;
    }
    if (results.promotionProducts?.text) {
      searchText += `

*🏷️ Productos en promoción:*
${results.promotionProducts.text}`;
    }

    return searchText;
  }
}

module.exports = MainSearchService;
