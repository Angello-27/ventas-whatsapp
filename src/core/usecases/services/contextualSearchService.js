// src/core/services/contextualSearchService.js

class ContextualSearchService {
    constructor(repos) {
        this.repos = repos;
    }

    /**
     * Obtiene colores de productos en contexto
     * @param {Array} lastItems - Items del contexto
     * @returns {Promise<string>}
     */
    async getColorsFromContext(lastItems) {
        if (!lastItems || lastItems.length === 0) {
            return 'No tengo productos en contexto para mostrar colores.';
        }

        try {
            const firstProduct = lastItems[0];
            const productoNombre = firstProduct.producto?.nombre || firstProduct.variante?.productoNombre;

            if (!productoNombre) {
                return 'No puedo determinar el producto para mostrar colores.';
            }

            const variants = await this.repos.pineVarianteRepo.semanticSearch(`producto ${productoNombre}`, 15);

            if (!variants || variants.length === 0) {
                return 'No encontré variantes de color para este producto.';
            }

            const colores = [...new Set(variants.map(v => v.variante.color))].filter(c => c);

            if (colores.length === 0) {
                return 'No hay información de colores disponible.';
            }

            return `*Colores disponibles para ${productoNombre}:*\n${colores.map(color => `• ${color}`).join('\n')}`;

        } catch (error) {
            console.error('Error obteniendo colores:', error);
            return 'Hubo un error consultando los colores disponibles.';
        }
    }

    /**
     * Obtiene tallas de productos en contexto
     * @param {Array} lastItems - Items del contexto
     * @returns {Promise<string>}
     */
    async getSizesFromContext(lastItems) {
        if (!lastItems || lastItems.length === 0) {
            return 'No tengo productos en contexto para mostrar tallas.';
        }

        try {
            const firstProduct = lastItems[0];
            const productoNombre = firstProduct.producto?.nombre || firstProduct.variante?.productoNombre;

            if (!productoNombre) {
                return 'No puedo determinar el producto para mostrar tallas.';
            }

            const variants = await this.repos.pineVarianteRepo.semanticSearch(`producto ${productoNombre}`, 15);

            if (!variants || variants.length === 0) {
                return 'No encontré variantes de talla para este producto.';
            }

            const tallas = [...new Set(variants.map(v => v.variante.talla))].filter(t => t);

            if (tallas.length === 0) {
                return 'No hay información de tallas disponible.';
            }

            return `*Tallas disponibles para ${productoNombre}:*\n${tallas.map(talla => `• ${talla}`).join('\n')}`;

        } catch (error) {
            console.error('Error obteniendo tallas:', error);
            return 'Hubo un error consultando las tallas disponibles.';
        }
    }

    /**
     * Obtiene precios de productos en contexto
     * @param {Array} lastItems - Items del contexto
     * @returns {string}
     */
    getPricesFromContext(lastItems) {
        if (!lastItems || lastItems.length === 0) {
            return 'No tengo productos en contexto para mostrar precios.';
        }

        const lines = lastItems.map((item, index) => {
            if (item.producto) {
                return `${index + 1}. *${item.producto.nombre}* - Consultar variantes para precios específicos`;
            } else if (item.variante) {
                return `${index + 1}. *${item.variante.productoNombre}* (${item.variante.color}, ${item.variante.talla}) - *$${item.variante.precioVenta}*`;
            }
            return `${index + 1}. Producto sin información de precio`;
        });

        return `*Precios de productos consultados:*\n${lines.join('\n')}`;
    }

    /**
     * Extiende la búsqueda con nuevos términos
     * @param {string} newQuery - Nueva consulta
     * @param {Array} lastItems - Items del contexto anterior
     * @returns {Promise<string>}
     */
    async extendSearch(newQuery, lastItems) {
        try {
            const { searchProducts } = require('./searchProducts');
            const { searchVariants } = require('./searchVariants');

            const newProductSearch = await searchProducts(newQuery, this.repos, 3);
            const newVariantSearch = await searchVariants(newQuery, this.repos, 3);

            const newProductText = typeof newProductSearch === 'object' ? newProductSearch.text : newProductSearch;
            const newVariantText = typeof newVariantSearch === 'object' ? newVariantSearch.text : newVariantSearch;

            let previousText = '';
            if (lastItems && lastItems.length > 0) {
                const prevLines = lastItems.slice(0, 3).map(item => {
                    if (item.producto) {
                        return `• ${item.producto.nombre} (${item.producto.marcaNombre})`;
                    } else if (item.variante) {
                        return `• ${item.variante.productoNombre} (${item.variante.color}, ${item.variante.talla})`;
                    }
                    return '• Producto consultado anteriormente';
                });
                previousText = `*Productos consultados anteriormente:*\n${prevLines.join('\n')}\n\n`;
            }

            return `${previousText}*Nuevos resultados:*\n${newProductText}\n\n*Nuevas variantes:*\n${newVariantText}`;

        } catch (error) {
            console.error('Error extendiendo búsqueda:', error);
            return 'Hubo un error al buscar nuevos productos.';
        }
    }
}

module.exports = ContextualSearchService;