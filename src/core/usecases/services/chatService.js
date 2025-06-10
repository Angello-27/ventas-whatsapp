// src/core/services/chatService.js

/**
 * ChatService:
 *   - Centraliza la lógica de cliente/sesión/mensajes en MySQL.
 *   - Carga el historial de la sesión al chatClient.
 *   - Maneja el contexto conversacional para seguimiento de productos/variantes.
 *   - Guarda mensajes entrantes y salientes.
 *   - Invoca el use case (handleIncomingMessage) para generar la respuesta.
 *
 * @param {{ from: string, body: string }} data
 * @param {object} repos          – Debe contener: repos.chatRepo, repos.pineProductoRepo, repos.pineVarianteRepo, etc.
 * @param {OpenAIClient} chatClient – Instancia de OpenAIClient (modelo chat)
 * @param {function} usecaseHandler – Función handleIncomingMessage del core (async ({from,body}, repos, chatClient, sesion) => string)
 *
 * @returns {Promise<string>} – La respuesta final generada por el use case
 */
async function processMessage({ from, body }, repos, chatClient, usecaseHandler) {
    const { chatRepo } = repos;

    try {
        // 1) BUSCAR o CREAR cliente
        let cliente = await chatRepo.findByTelefono(from);
        if (!cliente) {
            console.log(`📱 Nuevo cliente detectado: ${from}`);
            cliente = await chatRepo.create({
                nombre: null,
                telefono: from,
                email: null
            });
        }

        // 2) BUSCAR o CREAR sesión activa
        let sesion = await chatRepo.findActiveByClienteId(cliente.clienteId);
        if (!sesion) {
            console.log(`🆕 Creando nueva sesión para cliente ${cliente.clienteId}`);
            sesion = await chatRepo.createSession({ clienteId: cliente.clienteId });

            // Al iniciarse sesión nueva, vaciamos el historial interno de chatClient
            chatClient.resetHistory();
            console.log(`🔄 Historial de chatClient reiniciado para nueva sesión`);
        } else {
            console.log(`♻️ Sesión activa encontrada: ${sesion.sesionId}`);

            // 2.1) Si ya existe sesión, CARGAR historial completo de DB a chatClient.chatHistory
            const historyRows = await chatRepo.findMessagesBySesionId(sesion.sesionId);

            // Limpiar historial previo antes de cargar desde DB
            chatClient.resetHistory();

            // Cargar mensajes desde DB
            historyRows.forEach(msg => {
                chatClient.chatHistory.push({
                    role: msg.direccion === 'Entrante' ? 'user' : 'assistant',
                    content: msg.contenido
                });
            });

            console.log(`📚 Cargados ${historyRows.length} mensajes del historial`);

            // 2.2) Cargar contexto de la sesión (si existe)
            const contexto = sesion.getContexto ? sesion.getContexto() : null;
            if (contexto) {
                console.log(`🧠 Contexto cargado:`, {
                    tipo: contexto.lastType,
                    query: contexto.lastQuery,
                    items: contexto.lastItems?.length || 0
                });
            }
        }

        // 3) GUARDAR mensaje entrante
        console.log(`💬 Guardando mensaje entrante: "${body.substring(0, 50)}..."`);
        await chatRepo.saveMessage({
            sesionId: sesion.sesionId,
            direccion: 'Entrante',
            contenido: body
        });

        // 4) INVOCAR el use case para generar la respuesta
        // IMPORTANTE: Ahora pasamos la sesión como parámetro adicional
        console.log(`🤖 Invocando handleIncomingMessage...`);
        const reply = await usecaseHandler(
            { from, body },
            repos,
            chatClient,
            sesion  // ✅ NUEVO: Pasamos la sesión para que el use case pueda manejar contexto
        );

        // 5) GUARDAR mensaje saliente
        console.log(`📤 Guardando respuesta: "${reply.substring(0, 50)}..."`);
        await chatRepo.saveMessage({
            sesionId: sesion.sesionId,
            direccion: 'Saliente',
            contenido: reply
        });

        console.log(`✅ Procesamiento completado para ${from}`);
        return reply;

    } catch (error) {
        console.error(`❌ Error en processMessage para ${from}:`, error);

        // Respuesta de fallback en caso de error
        const fallbackReply = 'Lo siento, hubo un problema procesando tu mensaje. Por favor intenta de nuevo.';

        // Intentar guardar el error en logs (opcional)
        try {
            // Si hay sesión disponible, guardar mensaje de error
            if (sesion) {
                await chatRepo.saveMessage({
                    sesionId: sesion.sesionId,
                    direccion: 'Saliente',
                    contenido: fallbackReply
                });
            }
        } catch (logError) {
            console.error(`❌ Error guardando mensaje de fallback:`, logError);
        }

        return fallbackReply;
    }
}

/**
 * Función auxiliar para finalizar una sesión de chat
 * @param {string} telefono - Teléfono del cliente
 * @param {object} repos - Repositorios
 * @returns {Promise<boolean>} - True si se finalizó correctamente
 */
async function endSession(telefono, repos) {
    const { chatRepo } = repos;

    try {
        console.log(`🔚 Finalizando sesión para ${telefono}`);

        const cliente = await chatRepo.findByTelefono(telefono);
        if (!cliente) {
            console.log(`⚠️ Cliente no encontrado: ${telefono}`);
            return false;
        }

        const sesion = await chatRepo.findActiveByClienteId(cliente.clienteId);
        if (!sesion) {
            console.log(`⚠️ No hay sesión activa para cliente ${cliente.clienteId}`);
            return false;
        }

        await chatRepo.endSession(sesion.sesionId);
        console.log(`✅ Sesión ${sesion.sesionId} finalizada correctamente`);
        return true;

    } catch (error) {
        console.error(`❌ Error finalizando sesión para ${telefono}:`, error);
        return false;
    }
}

/**
 * Función auxiliar para obtener estadísticas de la sesión
 * @param {string} telefono - Teléfono del cliente
 * @param {object} repos - Repositorios
 * @returns {Promise<object|null>} - Estadísticas de la sesión
 */
async function getSessionStats(telefono, repos) {
    const { chatRepo } = repos;

    try {
        const cliente = await chatRepo.findByTelefono(telefono);
        if (!cliente) return null;

        const sesion = await chatRepo.findActiveByClienteId(cliente.clienteId);
        if (!sesion) return null;

        const mensajes = await chatRepo.findMessagesBySesionId(sesion.sesionId);
        const contexto = sesion.getContexto ? sesion.getContexto() : null;

        return {
            sesionId: sesion.sesionId,
            clienteId: cliente.clienteId,
            iniciadoEn: sesion.iniciadoEn,
            totalMensajes: mensajes.length,
            mensajesEntrantes: mensajes.filter(m => m.direccion === 'Entrante').length,
            mensajesSalientes: mensajes.filter(m => m.direccion === 'Saliente').length,
            tieneContexto: !!contexto,
            ultimoContexto: contexto
        };

    } catch (error) {
        console.error(`❌ Error obteniendo estadísticas para ${telefono}:`, error);
        return null;
    }
}

module.exports = {
    processMessage,
    endSession,
    getSessionStats
};