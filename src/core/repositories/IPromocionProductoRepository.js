// src/core/repositories/IPromocionProductoRepository.js
class IPromocionProductoRepository {
    /**
     * Devuelve todas las relaciones promoción–producto activas desde la vista.
     * @returns {Promise<import('../entities/PromocionProducto')[]>}
     */
    async findAllActive() {
        throw new Error('IPromocionProductoRepository.findAllActive no implementado.');
    }
}

module.exports = IPromocionProductoRepository;
