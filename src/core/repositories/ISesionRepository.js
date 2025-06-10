// src\core\repositories\ISesionRepository.js

/**
 * Interfaz para acceso a la entidad Sesion.
 * Permite crear sesiones, marcar fin, obtener sesión activa y manejar contexto.
 */
class ISesionRepository {
    /**
     * Busca la sesión activa de un cliente (clienteId) que no tenga finalizadoEn.
     * @param {number} clienteId
     * @returns {Promise<import('../entities/Sesion') | null>}
     */
    async findActiveByClienteId(clienteId) {
        throw new Error('ISesionRepository.findActiveByClienteId no implementado.');
    }

    /**
     * Crea una nueva sesión para un cliente.
     * @param {{ clienteId: number }} data
     * @returns {Promise<import('../entities/Sesion')>}
     */
    async createSession(data) {
        throw new Error('ISesionRepository.createSession no implementado.');
    }

    /**
     * Marca una sesión como finalizada (pone finalizadoEn = NOW()).
     * @param {number} sesionId
     * @returns {Promise<void>}
     */
    async endSession(sesionId) {
        throw new Error('ISesionRepository.endSession no implementado.');
    }

    /**
     * Actualiza el contexto de una sesión.
     * @param {number} sesionId
     * @param {object} contextObj
     * @returns {Promise<void>}
     */
    async updateSessionContext(sesionId, contextObj) {
        throw new Error('ISesionRepository.updateSessionContext no implementado.');
    }

    /**
     * Obtiene el contexto guardado de una sesión.
     * @param {number} sesionId
     * @returns {Promise<object|null>}
     */
    async getSessionContext(sesionId) {
        throw new Error('ISesionRepository.getSessionContext no implementado.');
    }
}

module.exports = ISesionRepository;