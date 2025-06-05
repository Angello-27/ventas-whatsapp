// src/core/repositories/ISesionChatRepository.js

/**
 * Interfaz para acceso a la entidad SesionChat.
 * Permite crear sesiones, marcar fin, y obtener la sesión activa de un cliente.
 */
class ISesionChatRepository {
    /**
     * Busca la sesión activa de un cliente (clienteId) que no tenga finalizadoEn.
     * @param {number} clienteId
     * @returns {Promise<import('../entities/SesionChat') | null>}
     */
    async findActiveByClienteId(clienteId) {
        throw new Error('ISesionChatRepository.findActiveByClienteId no implementado.');
    }

    /**
     * Crea una nueva sesión para un cliente.
     * @param {{ clienteId: number }} data
     * @returns {Promise<import('../entities/SesionChat')>}
     */
    async create(data) {
        throw new Error('ISesionChatRepository.create no implementado.');
    }

    /**
     * Marca una sesión como finalizada (pone finalizadoEn = NOW()).
     * @param {number} sesionId
     * @returns {Promise<void>}
     */
    async end(sesionId) {
        throw new Error('ISesionChatRepository.end no implementado.');
    }
}

module.exports = ISesionChatRepository;
