// src/core/repositories/IProductoVarianteRepository.js
class IProductoVarianteRepository {
    /**
     * Devuelve todas las variantes de producto activas desde la vista.
     * @returns {Promise<import('../entities/Variante')[]>}
     */
    async findAllActive() {
        throw new Error('IProductoVarianteRepository.findAllActive no implementado.');
    }
}

module.exports = IProductoVarianteRepository;
