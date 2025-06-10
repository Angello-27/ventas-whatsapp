// ================================
// 5. CASO DE USO REFACTORIZADO
// ================================
// src/core/usecases/handleIncomingMessage.js

const { buildSystemChatPrompt } = require('../../infrastructure/openai/prompts/baseChatPrompt');
const { buildUserChatPrompt } = require('../../infrastructure/openai/prompts/userChatPrompt');

// Servicios especializados
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
   * @param {object} followUp - Resultado de detección
   * @param {Array} contextItems - Items del contexto
   * @returns {Promise<string>}
   */
  async process(followUp, contextItems) {
    console.log(`♻️ Procesando follow-up: ${followUp.type} (confianza: ${followUp.confidence})`);

    switch (followUp.type) {
      case 'colors':
        return await this.contextualSearch.getColorsFromContext(contextItems);

      case 'sizes':
        return await this.contextualSearch.getSizesFromContext(contextItems);

      case 'prices':
        return this.contextualSearch.getPricesFromContext(contextItems);

      case 'extend':
        return await this.contextualSearch.extendSearch(followUp.query, contextItems);

      case 'materials':
        return 'Consultando materiales disponibles... Esta función está en desarrollo.';

      case 'promotions':
        return await this._handlePromotions(contextItems);

      case 'promotion_details':
        return await this._handlePromotionDetails(contextItems);

      default:
        console.warn(`⚠️ Tipo de follow-up no manejado: ${followUp.type}`);
        return null;
    }
  }

  async _handlePromotions(contextItems) {
    try {
      const { findPromotionsForContext } = require('../services/contextualPromotionSearch');
      return await findPromotionsForContext(contextItems, this.contextualSearch.repos);
    } catch (error) {
      console.warn('⚠️ Servicios de promociones no disponibles:', error.message);
      return 'Las promociones no están disponibles en este momento.';
    }
  }

  async _handlePromotionDetails(contextItems) {
    try {
      // Lógica para obtener detalles de promoción específica
      return 'Detalles de promoción no implementados aún.';
    } catch (error) {
      console.warn('⚠️ Detalles de promoción no disponibles:', error.message);
      return 'Los detalles de promoción no están disponibles en este momento.';
    }
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
   * Obtiene el contexto de la sesión
   * @param {Sesion} sesion - Entidad de sesión
   * @returns {object|null}
   */
  getContext(sesion) {
    if (typeof sesion.getContexto !== 'function') {
      console.warn('⚠️ Sesión no tiene método getContexto');
      return null;
    }

    const context = sesion.getContexto();
    console.log(`🧠 Contexto obtenido:`, context ? {
      tipo: context.lastType,
      query: context.lastQuery,
      items: context.lastItems?.length || 0,
      terms: context.keyTerms ? Object.keys(context.keyTerms) : []
    } : 'Sin contexto');

    return context;
  }

  /**
   * Guarda el contexto en la sesión
   * @param {Sesion} sesion - Entidad de sesión
   * @param {object} newContext - Nuevo contexto
   * @returns {Promise<boolean>}
   */
  async saveContext(sesion, newContext) {
    if (!newContext) {
      console.log('📭 No hay contexto para guardar');
      return false;
    }

    if (typeof sesion.setContexto !== 'function') {
      console.warn('⚠️ Sesión no tiene método setContexto');
      return false;
    }

    try {
      console.log(`💾 Guardando contexto:`, {
        tipo: newContext.lastType,
        items: newContext.lastItems?.length || 0
      });

      sesion.setContexto(newContext);
      await this.repos.chatRepo.updateSessionContext(sesion.sesionId, newContext);
      return true;

    } catch (error) {
      console.error('❌ Error guardando contexto:', error);
      return false;
    }
  }
}

/**
 * Coordinador principal del procesamiento de mensajes
 */
class MessageProcessor {
  constructor(repos) {
    this.repos = repos;
    this.followUpDetection = new FollowUpDetectionService();
    this.followUpProcessor = new FollowUpProcessor(repos);
    this.mainSearch = new MainSearchService(repos);
    this.contextManager = new SessionContextManager(repos);
  }

  /**
   * Procesa un mensaje y genera la respuesta
   * @param {object} messageData - {from, body}
   * @param {OpenAIClient} chatClient - Cliente de OpenAI
   * @param {Sesion} sesion - Entidad de sesión
   * @returns {Promise<string>}
   */
  async processMessage(messageData, chatClient, sesion) {
    const { from, body } = messageData;

    try {
      // 1. Verificar entidad de sesión
      this._validateSession(sesion);

      // 2. Obtener contexto actual
      const context = this.contextManager.getContext(sesion);

      // 3. Detectar tipo de mensaje
      const followUp = this.followUpDetection.detectFollowUp(body);
      console.log('🔍 Análisis de mensaje:', {
        isFollowUp: followUp.isFollowUp,
        type: followUp.type,
        confidence: followUp.confidence,
        hasContext: !!context,
        contextItems: context?.lastItems?.length || 0
      });

      // 4. Procesar según el tipo
      let searchText, newContext;

      if (followUp.isFollowUp && context?.lastItems?.length > 0) {
        searchText = await this.followUpProcessor.process(followUp, context.lastItems);
        newContext = context; // Mantener contexto existente
      } else {
        // Búsqueda normal
        console.log('🔍 Realizando búsqueda normal');
        searchText = await this.mainSearch.performSearch(body);
        newContext = await this.mainSearch.createSearchContext(body);
      }

      // 5. Guardar contexto
      await this.contextManager.saveContext(sesion, newContext);

      // 6. Generar respuesta
      const response = await this._generateResponse(messageData, searchText, chatClient);

      console.log(`✅ Procesamiento completado para ${from}`);
      return response;

    } catch (error) {
      console.error(`❌ Error procesando mensaje de ${from}:`, error);
      return 'Lo siento, hubo un problema procesando tu consulta. ¿Podrías intentar de nuevo?';
    }
  }

  /**
   * Valida que la sesión tenga los métodos necesarios
   * @param {Sesion} sesion 
   */
  _validateSession(sesion) {
    const validation = {
      tipo: sesion.constructor.name,
      sesionId: sesion.sesionId,
      tieneSetContexto: typeof sesion.setContexto === 'function',
      tieneGetContexto: typeof sesion.getContexto === 'function'
    };

    console.log('🔍 Validación de sesión:', validation);

    if (!validation.tieneSetContexto || !validation.tieneGetContexto) {
      throw new Error(`Sesión inválida: faltan métodos de contexto`);
    }
  }

  /**
   * Genera respuesta usando OpenAI
   * @param {object} messageData - {from, body}
   * @param {string} searchText - Texto de búsqueda
   * @param {OpenAIClient} chatClient - Cliente OpenAI
   * @returns {Promise<string>}
   */
  async _generateResponse(messageData, searchText, chatClient) {
    const { from, body } = messageData;

    const systemPrompt = buildSystemChatPrompt();
    const userPrompt = buildUserChatPrompt({ from, body });

    console.log(`🤖 Generando respuesta con OpenAI...`);

    const reply = await chatClient.chat({
      systemPrompt,
      userMessage: userPrompt + '\n\n' + searchText
    });

    console.log(`✅ Respuesta generada: "${reply.substring(0, 100)}..."`);
    return reply;
  }
}

/**
 * Caso de uso principal - SIMPLIFICADO
 * @param {{ from: string, body: string }} data
 * @param {object} repos - Repositorios
 * @param {OpenAIClient} chatClient - Cliente OpenAI
 * @param {Sesion} sesion - Entidad de sesión
 * @returns {Promise<string>}
 */
async function handleIncomingMessage(data, repos, chatClient, sesion) {
  const { from, body } = data;
  console.log(`🎯 Procesando mensaje de ${from}: "${body}"`);

  // Crear el procesador principal
  const processor = new MessageProcessor(repos);

  // Delegar el procesamiento completo al procesador
  return await processor.processMessage(data, chatClient, sesion);
}

module.exports = handleIncomingMessage;