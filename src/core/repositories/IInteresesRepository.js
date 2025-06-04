// core/repositories/IInteresesRepository.js

/**
 * Interfaz para acceso a la entidad Intereses (antes CustomerIntereses).
 * Guarda o recupera los intereses extraídos para cada cliente.
 */
class IInteresesRepository {
    /**
     * Busca los intereses de un cliente dado su ID.
     * @param {number} clienteId
     * @returns {Promise<import('../entities/Intereses') | null>}
     */
    async findByClienteId(clienteId) {
        throw new Error('IInteresesRepository.findByClienteId no implementado.');
    }

    /**
     * Crea o actualiza la lista de intereses de un cliente.
     * @param {{ clienteId: number, intereses: string }} data
     * @returns {Promise<import('../entities/Intereses')>}
     */
    async saveOrUpdate(data) {
        throw new Error('IInteresesRepository.saveOrUpdate no implementado.');
    }
}

module.exports = IInteresesRepository;
