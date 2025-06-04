// core/repositories/IProductoRepository.js

/**
 * Interfaz para acceso a la entidad Producto.
 * Define métodos de consulta, soporte para buscar por marca o categoría, etc.
 */
class IProductoRepository {
    /**
     * Devuelve todos los productos activos.
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findAllActive() {
        throw new Error('IProductoRepository.findAllActive no implementado.');
    }

    /**
     * Busca un producto por su ID.
     * @param {number} productoId
     * @returns {Promise<import('../entities/Producto') | null>}
     */
    async findById(productoId) {
        throw new Error('IProductoRepository.findById no implementado.');
    }

    /**
     * Busca productos activos filtrando por marca.
     * @param {number} marcaId
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findByMarca(marcaId) {
        throw new Error('IProductoRepository.findByMarca no implementado.');
    }

    /**
     * Busca productos activos filtrando por categoría.
     * @param {number} categoriaId
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findByCategoria(categoriaId) {
        throw new Error('IProductoRepository.findByCategoria no implementado.');
    }
}

module.exports = IProductoRepository;
