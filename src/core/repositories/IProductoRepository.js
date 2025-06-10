// src/core/repositories/IProductoRepository.js
class IProductoRepository {
    /**
     * Devuelve todos los productos “planos” activos desde la vista.
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findAllActive() {
        throw new Error('IProductoRepository.findAllActive no implementado.');
    }
}

module.exports = IProductoRepository;
