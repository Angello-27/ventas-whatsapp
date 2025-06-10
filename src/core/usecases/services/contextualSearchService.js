// src/core/services/contextualSearchService.js

const { searchProducts }       = require('./searchProducts');
const { searchProductVariants } = require('./searchProductVariants');

/**
 * ContextualSearchService:
 *   - Opera sobre el array lastItems guardado en sesión
 *   - Extrae colores, tallas y precios directamente de lastItems
 *   - Extiende la búsqueda conservando el contexto previo
 */
class ContextualSearchService {
  constructor(repos) {
    this.repos = repos;
  }

  /**
   * Obtiene colores únicos de lastItems
   * @param {Array} lastItems
   * @returns {string}
   */
  getColorsFromContext(lastItems) {
    console.log('🖌️ ContextualSearch: getColorsFromContext, items=', lastItems.length);
    if (!lastItems || !lastItems.length) {
      return 'No tengo productos en contexto para mostrar colores.';
    }
    const colors = [...new Set(
      lastItems
        .filter(i => i.type === 'variant')
        .map(v => v.variante.color)
        .filter(Boolean)
    )];
    console.log(`   → Colores extraídos: ${colors.join(', ')}`);
    if (!colors.length) {
      return 'No hay información de colores disponible para los productos consultados.';
    }
    return `*Colores disponibles:*
${colors.map(c => `• ${c}`).join('\n')}`;
  }

  /**
   * Obtiene tallas únicas de lastItems
   * @param {Array} lastItems
   * @returns {string}
   */
  getSizesFromContext(lastItems) {
    console.log('🖌️ ContextualSearch: getSizesFromContext, items=', lastItems.length);
    if (!lastItems || !lastItems.length) {
      return 'No tengo productos en contexto para mostrar tallas.';
    }
    const sizes = [...new Set(
      lastItems
        .filter(i => i.type === 'variant')
        .map(v => v.variante.talla)
        .filter(Boolean)
    )];
    console.log(`   → Tallas extraídas: ${sizes.join(', ')}`);
    if (!sizes.length) {
      return 'No hay información de tallas disponible para los productos consultados.';
    }
    return `*Tallas disponibles:*
${sizes.map(s => `• ${s}`).join('\n')}`;
  }

  /**
   * Muestra precios de lastItems
   * @param {Array} lastItems
   * @returns {string}
   */
  getPricesFromContext(lastItems) {
    console.log('🖌️ ContextualSearch: getPricesFromContext, items=', lastItems.length);
    if (!lastItems || !lastItems.length) {
      return 'No tengo productos en contexto para mostrar precios.';
    }
    const lines = lastItems.map((item, idx) => {
      if (item.type === 'product') {
        return `${idx + 1}. *${item.producto.nombre}* (Marca: ${item.producto.marcaNombre}) - Consultar variantes para precios específicos`;
      } else if (item.type === 'variant') {
        return `${idx + 1}. *${item.variante.productoNombre}* (${item.variante.color}, ${item.variante.talla}) — *$${item.variante.precioVenta}*`;
      }
      return `${idx + 1}. Item sin información de precio`;
    });
    return `*Precios de productos consultados:*
${lines.join('\n')}`;
  }

  /**
   * Extiende la búsqueda combinando items previos y nuevos resultados
   * @param {string} newQuery
   * @param {Array} lastItems
   * @returns {Promise<string>}
   */
  async extendSearch(newQuery, lastItems) {
    console.log(`🖌️ ContextualSearch: extendSearch con query='${newQuery}', itemsPrevios=${lastItems.length}`);
    // Construir resumen de items anteriores
    let previousText = '';
    if (lastItems && lastItems.length) {
      const prevLines = lastItems.slice(0, 3).map((item, i) => {
        if (item.type === 'product') {
          return `• ${item.producto.nombre} (${item.producto.marcaNombre}, ${item.producto.categoriaNombre})`;
        } else if (item.type === 'variant') {
          return `• ${item.variante.productoNombre} (${item.variante.color}, ${item.variante.talla})`;
        }
        return `• Item ${i + 1}`;
      });
      previousText = `*Consultados anteriormente:*
${prevLines.join('\n')}

`;
    }

    // Ejecutar nuevas búsquedas
    const prodSearch  = await searchProducts(newQuery, this.repos, 3);
    const varSearch   = await searchProductVariants(newQuery, this.repos, 3);

    const newProductText = prodSearch.text;
    const newVariantText = varSearch.text;

    console.log('   → Nuevos productos:', newProductText.split('\n').length, 'líneas');
    console.log('   → Nuevas variantes:', newVariantText.split('\n').length, 'líneas');

    return `${previousText}*Nuevos resultados:*
${newProductText}

*Variantes nuevas:*
${newVariantText}`;
  }
}

module.exports = ContextualSearchService;
