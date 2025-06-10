// src/core/usecases/handleIncomingMessage.js

const { buildSystemChatPrompt } = require('../../infrastructure/openai/prompts/baseChatPrompt');
const { buildUserChatPrompt } = require('../../infrastructure/openai/prompts/userChatPrompt');

const FollowUpDetectionService = require('./services/followUpDetectionService');
const ContextualSearchService = require('./services/contextualSearchService');
const MainSearchService = require('./services/mainSearchService');

/**
 * Procesador de seguimientos contextuales
 */
class FollowUpProcessor {
  constructor(repos) {
    this.contextualSearch = new ContextualSearchService(repos);
  }

  /**
   * Procesa un follow-up según su tipo
   * @param {object} followUp      Resultado de FollowUpDetectionService.detectFollowUp
   * @param {Array}  contextItems  Items guardados en contexto
   * @returns {Promise<string>}
   */
  async process(followUp, contextItems) {
    console.log(`♻️ Procesando follow-up: ${followUp.type} (confidence: ${followUp.confidence.toFixed(2)})`);

    switch (followUp.type) {
      case 'colors':
        return this.contextualSearch.getColorsFromContext(contextItems);
      case 'sizes':
        return this.contextualSearch.getSizesFromContext(contextItems);
      case 'prices':
        return this.contextualSearch.getPricesFromContext(contextItems);
      case 'extend':
        return this.contextualSearch.extendSearch(followUp.query, contextItems);

      // ✅ NUEVO: Agregar caso para promociones
      case 'promotions':
        return this.getPromotionsFromContext(contextItems);

      default:
        console.warn(`⚠️ Follow-up type no manejado: ${followUp.type}`);
        return 'Lo siento, no entendí tu solicitud de seguimiento.';
    }
  }

  /**
   * Extrae y formatea las promociones del contexto actual
   * @param {Array} contextItems - Items del contexto actual
   * @returns {string} - Texto formateado con las promociones disponibles
   */
  getPromotionsFromContext(contextItems) {
    console.log(`🎉 Extrayendo promociones del contexto (${contextItems.length} items)`);

    // Filtrar promociones y productos en promoción
    const promotions = contextItems.filter(item => item.type === 'promotion');
    const promoProducts = contextItems.filter(item => item.type === 'promoProduct');

    if (promotions.length === 0 && promoProducts.length === 0) {
      return 'No encontré promociones activas en los productos que te mostré anteriormente.';
    }

    let result = '';

    // Mostrar promociones generales
    if (promotions.length > 0) {
      result += '*🎉 Promociones activas:*\n';
      promotions.forEach(item => {
        const promo = item.promocion;
        const descuentoNum = typeof promo.descuento === 'string'
          ? parseFloat(promo.descuento)
          : promo.descuento;

        const descuentoText = promo.tipoPromo === 'Porcentaje'
          ? `${descuentoNum}% OFF`
          : `$${isNaN(descuentoNum) ? 'N/A' : descuentoNum.toFixed(2)} de descuento`;

        result += `• ${promo.titulo} - ${descuentoText}\n`;
        result += `  📅 Válida hasta: ${new Date(promo.fechaFin).toLocaleDateString()}\n`;
      });
    }

    // Mostrar productos específicos en promoción
    if (promoProducts.length > 0) {
      if (result) result += '\n';
      result += '*🏷️ Productos en promoción:*\n';
      promoProducts.forEach(item => {
        const pp = item.promocionProducto;
        result += `• ${pp.productoNombre} (${pp.marcaNombre})\n`;
        result += `  🎁 Promoción: ${pp.promocionTitulo}\n`;
      });
    }

    return result.trim();
  }
}

/**
 * Gestor de contexto de sesión
 */
class SessionContextManager {
  constructor(repos) {
    this.repos = repos;
  }

  /**
   * Lee el contexto JSON de la sesión y lo devuelve
   * @param {Sesion} sesion
   * @returns {object|null}
   */
  getContext(sesion) {
    const ctx = sesion.getContexto();
    console.log(`🧠 Contexto actual:`, ctx
      ? { type: ctx.lastType, query: ctx.lastQuery, items: ctx.lastItems.length }
      : 'Sin contexto'
    );
    return ctx;
  }

  /**
   * Persiste el nuevo contexto en la sesión
   * @param {Sesion} sesion
   * @param {object} newContext
   */
  async saveContext(sesion, newContext) {
    if (!newContext) {
      console.log('📭 No hay nuevo contexto para guardar');
      return;
    }
    console.log(`💾 Guardando contexto: type=${newContext.lastType}, items=${newContext.lastItems.length}`);
    sesion.setContexto(newContext);
    await this.repos.chatRepo.updateSessionContext(sesion.sesionId, newContext);
  }
}

/**
 * Coordinador principal del procesamiento de mensajes
 */
class MessageProcessor {
  constructor(repos) {
    this.repos = repos;
    this.followUpDetector = new FollowUpDetectionService();
    this.followUpProc = new FollowUpProcessor(repos);
    this.mainSearch = new MainSearchService(repos);
    this.contextManager = new SessionContextManager(repos);
  }

  /**
   * Procesa un mensaje y devuelve la respuesta
   * @param {{ from: string, body: string }} messageData
   * @param {OpenAIClient} chatClient
   * @param {Sesion} sesion
   * @returns {Promise<string>}
   */
  async processMessage(messageData, chatClient, sesion) {
    const { from, body } = messageData;
    console.log(`🎯 Iniciando procesamiento para ${from}: "${body}"`);

    // Validamos que la sesión tenga métodos de contexto
    const hasGet = typeof sesion.getContexto === 'function';
    const hasSet = typeof sesion.setContexto === 'function';
    if (!hasGet || !hasSet) {
      throw new Error('Sesión inválida: faltan métodos de contexto');
    }

    // 1) Obtener contexto guardado
    const context = this.contextManager.getContext(sesion);

    // 2) Detectar si es un follow-up
    const followUp = this.followUpDetector.detectFollowUp(body);
    console.log('🔍 FollowUp detection:', followUp);

    let searchResultText;
    let newContext;

    // 3) Si es follow-up válido y hay contexto previo
    if (followUp.isFollowUp && context && context.lastItems.length) {
      searchResultText = await this.followUpProc.process(followUp, context.lastItems);
      newContext = context; // mantenemos el mismo contexto
    } else {
      // 4) Búsqueda normal: obtiene { text, items }
      console.log('🔎 Realizando búsqueda principal');
      const { text, items } = await this.mainSearch.performSearch(body);
      searchResultText = text;
      newContext = {
        lastType: 'search',
        lastQuery: body,
        lastItems: items,
        timestamp: new Date().toISOString()
      };
    }

    // 5) Guardar el contexto resultante
    await this.contextManager.saveContext(sesion, newContext);

    // 6) Construir y enviar a OpenAI
    const systemPrompt = buildSystemChatPrompt();
    const userPrompt = buildUserChatPrompt({ from, body });
    console.log('🤖 Enviando a OpenAI...');
    const reply = await chatClient.chat({
      systemPrompt,
      userMessage: `${userPrompt}\n\n${searchResultText}`
    });
    console.log(`✅ Respuesta recibida: "${reply.slice(0, 80)}..."`);

    return reply;
  }
}

/**
 * Use case principal
 */
async function handleIncomingMessage(data, repos, chatClient, sesion) {
  const processor = new MessageProcessor(repos);
  return processor.processMessage(data, chatClient, sesion);
}

module.exports = handleIncomingMessage;