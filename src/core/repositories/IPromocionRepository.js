// src/core/repositories/IPromocionRepository.js
class IPromocionRepository {
    /**
     * Devuelve todas las promociones activas desde la vista.
     * @returns {Promise<import('../entities/Promocion')[]>}
     */
    async findAllActive() {
        throw new Error('IPromocionRepository.findAllActive no implementado.');
    }
}

module.exports = IPromocionRepository;
