// src/core/services/queryEnhancementService.js

class QueryEnhancementService {
    constructor() {
        this.productMappings = {
            // Pantalones
            'jeans': 'pantalón jeans denim',
            'jean': 'pantalón jean denim',
            'vaqueros': 'pantalón vaquero denim',
            'mezclilla': 'pantalón mezclilla denim',
            'denim': 'pantalón denim',

            // Camisetas
            'playera': 'camiseta playera',
            'polera': 'camiseta polera',
            'remera': 'camiseta remera',
            'franela': 'camiseta franela',
            't-shirt': 'camiseta',
            'tshirt': 'camiseta',

            // Zapatos
            'tenis': 'zapatos tenis deportivos',
            'zapatillas': 'zapatos zapatillas deportivos',
            'sneakers': 'zapatos deportivos',
            'deportivos': 'zapatos deportivos',

            // Chaquetas
            'chamarra': 'chaqueta chamarra',
            'campera': 'chaqueta campera',
            'casaca': 'chaqueta casaca',
            'abrigo': 'chaqueta abrigo',

            // Géneros
            'hombre': 'hombre masculino',
            'mujer': 'mujer femenino',
            'niña': 'niños niña femenino',
            'niño': 'niños niño masculino',
            'bebe': 'bebé niños',
            'infantil': 'niños'
        };
    }

    /**
     * Mejora la consulta del usuario para mejor matching semántico
     * @param {string} originalQuery - Consulta original del usuario
     * @returns {string} - Consulta mejorada
     */
    enhanceQuery(originalQuery) {
        const text = originalQuery.toLowerCase();
        let enhancedTerms = [];

        // Buscar mappings aplicables
        for (const [term, enhancement] of Object.entries(this.productMappings)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            if (regex.test(text)) {
                enhancedTerms.push(enhancement);
            }
        }

        if (enhancedTerms.length > 0) {
            const enhancedQuery = `${originalQuery} ${enhancedTerms.join(' ')}`;
            console.log(`🔄 Query mejorada: "${originalQuery}" → "${enhancedQuery}"`);
            return enhancedQuery;
        }

        return originalQuery;
    }

    /**
     * Extrae términos clave de la consulta
     * @param {string} query - Consulta del usuario
     * @returns {object} - Términos categorizados
     */
    extractKeyTerms(query) {
        const text = query.toLowerCase();

        return {
            productos: this._extractProducts(text),
            generos: this._extractGenders(text),
            marcas: this._extractBrands(text),
            colores: this._extractColors(text),
            tallas: this._extractSizes(text)
        };
    }

    _extractProducts(text) {
        const productos = [];
        for (const [term] of Object.entries(this.productMappings)) {
            if (text.includes(term)) {
                productos.push(term);
            }
        }
        return productos;
    }

    _extractGenders(text) {
        const generos = [];
        ['hombre', 'mujer', 'niño', 'niña', 'unisex', 'infantil'].forEach(genero => {
            if (text.includes(genero)) generos.push(genero);
        });
        return generos;
    }

    _extractBrands(text) {
        const marcas = [];
        ['nike', 'adidas', 'puma', 'zara', 'h&m', 'gap'].forEach(marca => {
            if (text.includes(marca)) marcas.push(marca);
        });
        return marcas;
    }

    _extractColors(text) {
        const colores = [];
        ['negro', 'blanco', 'azul', 'rojo', 'verde', 'amarillo', 'gris'].forEach(color => {
            if (text.includes(color)) colores.push(color);
        });
        return colores;
    }

    _extractSizes(text) {
        const tallas = [];
        ['xs', 's', 'm', 'l', 'xl', 'xxl', 'chico', 'mediano', 'grande'].forEach(talla => {
            if (text.includes(talla)) tallas.push(talla);
        });
        return tallas;
    }
}

module.exports = QueryEnhancementService;