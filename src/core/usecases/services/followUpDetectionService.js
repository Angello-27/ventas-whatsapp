// src/core/services/followUpDetectionService.js

/**
 * Detecta y clasifica follow-ups en base a patrones y contexto previo
 */
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
        'adidas', 'nike', 'puma', 'zara', 'h&m', 'gap'
      ],
      extendKeywords: [
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
   * Detecta follow-up en el mensaje
   * @param {string} body           Texto del usuario
   * @param {boolean} hasContext    True si existe contexto previo
   * @returns {{isFollowUp: boolean, type: string|null, query: string, matchedPatterns: string[], confidence: number}}
   */
  detectFollowUp(body, hasContext = false) {
    console.log('🔍 Detectando follow-up en:', body);
    const text = body.trim().toLowerCase();

    // Evaluar cada tipo de patrón
    for (const [type, patterns] of Object.entries(this.patterns)) {
      const matches = patterns.filter(pat => text.includes(pat));
      if (matches.length > 0) {
        let followType = type;
        // Si es brand y ya hay contexto, convertimos a 'extend'
        if (type === 'brands' && hasContext) {
          followType = 'extend';
          console.log(`   → Patrón brands detectado con contexto, mapeando a 'extend'`);
        }
        const confidence = matches.length / patterns.length;
        console.log(`   → Matched ${type}: [${matches.join(', ')}], confidence=${confidence.toFixed(2)}`);
        return {
          isFollowUp: true,
          type: followType,
          query: text,
          matchedPatterns: matches,
          confidence
        };
      }
    }

    console.log('   → No se detectó follow-up');
    return { isFollowUp: false, type: null, query: text, matchedPatterns: [], confidence: 0 };
  }

  /**
   * Asigna prioridad al follow-up
   */
  getPriority(followUp) {
    if (!followUp.isFollowUp) return 'none';
    const high = ['colors','sizes','prices'];
    const med  = ['promotions','promotion_details'];
    if (high.includes(followUp.type)) return 'high';
    if (med.includes(followUp.type))  return 'medium';
    return 'low';
  }
}

module.exports = FollowUpDetectionService;
