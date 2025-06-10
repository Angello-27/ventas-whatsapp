// src/core/services/followUpDetectionService.js

class FollowUpDetectionService {
    constructor() {
        this.patterns = {
            colors: [
                'color', 'colores', 'que colores', 'qué colores',
                'de que color', 'de qué color', 'tonos', 'matices'
            ],
            sizes: [
                'talla', 'tallas', 'que tallas', 'qué tallas',
                'tamaño', 'tamaños', 'medida', 'medidas', 'size'
            ],
            prices: [
                'precio', 'precios', 'cuesta', 'vale', 'valor',
                'cuanto', 'cuánto', 'cost'
            ],
            brands: [
                'adidas', 'nike', 'puma', 'zara', 'h&m', 'gap',
                'también', 'además', 'otra marca', 'otras marcas'
            ],
            materials: [
                'material', 'materiales', 'tela', 'tejido', 'algodón',
                'poliéster', 'lycra', 'spandex'
            ],
            promotions: [
                'promocion', 'promociones', 'oferta', 'ofertas', 'descuento', 'descuentos',
                'rebaja', 'rebajas', 'promo', 'promos', 'especial', 'liquidacion'
            ],
            promotion_details: [
                'productos en promocion', 'que productos', 'que tiene la promocion',
                'detalles de la promocion', 'productos de la oferta'
            ]
        };
    }

    /**
     * Detecta si el mensaje es un follow-up contextual
     * @param {string} body - Mensaje del usuario
     * @returns {object} { isFollowUp: boolean, type: string, query: string, confidence: number }
     */
    detectFollowUp(body) {
        const text = body.trim().toLowerCase();

        for (const [type, patterns] of Object.entries(this.patterns)) {
            const matches = patterns.filter(pattern => text.includes(pattern));

            if (matches.length > 0) {
                const confidence = matches.length / patterns.length;
                return {
                    isFollowUp: true,
                    type,
                    query: text,
                    matchedPatterns: matches,
                    confidence
                };
            }
        }

        return { isFollowUp: false, type: null, query: text, confidence: 0 };
    }

    /**
     * Determina la prioridad del follow-up
     * @param {object} followUp - Resultado de detectFollowUp
     * @returns {string} - high, medium, low
     */
    getPriority(followUp) {
        if (!followUp.isFollowUp) return 'none';

        const highPriority = ['colors', 'sizes', 'prices'];
        const mediumPriority = ['promotions', 'promotion_details'];

        if (highPriority.includes(followUp.type)) return 'high';
        if (mediumPriority.includes(followUp.type)) return 'medium';
        return 'low';
    }
}

module.exports = FollowUpDetectionService;