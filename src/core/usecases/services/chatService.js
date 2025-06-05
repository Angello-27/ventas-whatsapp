// src/core/services/chatService.js

/**
 * ChatService:
 *   - Centraliza la lógica de cliente/​sesión/​mensajes en MySQL.
 *   - Carga el historial de la sesión al chatClient.
 *   - Guarda mensajes entrantes y salientes.
 *   - Invoca el use case (handleIncomingMessage) para generar la respuesta.
 *
 * @param {{ from: string, body: string }} data
 * @param {object} repos          – Debe contener: repos.chatRepo, repos.pineProductoRepo, repos.pineVarianteRepo, etc.
 * @param {OpenAIClient} chatClient – Instancia de OpenAIClient (modelo chat)
 * @param {function} usecaseHandler – Función handleIncomingMessage del core (async ({from,body}, repos, chatClient) => string)
 *
 * @returns {Promise<string>} – La respuesta final generada por el use case
 */
async function processMessage({ from, body }, repos, chatClient, usecaseHandler) {
    const { chatRepo } = repos;

    // 1) BUSCAR o CREAR cliente
    let cliente = await chatRepo.findByTelefono(from);
    if (!cliente) {
        cliente = await chatRepo.create({ nombre: null, telefono: from, email: null });
    }

    // 2) BUSCAR o CREAR sesión activa
    let sesion = await chatRepo.findActiveByClienteId(cliente.clienteId);
    if (!sesion) {
        sesion = await chatRepo.createSession({ clienteId: cliente.clienteId });
        // Al iniciarse sesión nueva, vaciamos el historial interno de chatClient
        chatClient.resetHistory();
    } else {
        // 2.1) Si ya existe sesión, CARGAR historial completo de DB a chatClient.chatHistory
        const historyRows = await chatRepo.findMessagesBySesionId(sesion.sesionId);
        historyRows.forEach(msg => {
            chatClient.chatHistory.push({
                role: msg.direccion === 'Entrante' ? 'user' : 'assistant',
                content: msg.contenido
            });
        });
    }

    // 3) GUARDAR mensaje entrante
    await chatRepo.save({
        sesionId: sesion.sesionId,
        direccion: 'Entrante',
        contenido: body
    });

    // 4) INVOCAR el use case para generar la respuesta
    //    Se pasa { from, body }, repos, chatClient tal cual lo espera el use case
    const reply = await usecaseHandler({ from, body }, repos, chatClient);

    // 5) GUARDAR mensaje saliente
    await chatRepo.save({
        sesionId: sesion.sesionId,
        direccion: 'Saliente',
        contenido: reply
    });

    return reply;
}

module.exports = { processMessage };
