// src/core/repositories/IProductoRepository.js

/**
 * Interfaz para acceso a la vistaproductos.
 * Define métodos de consulta para todos los productos “planos” (ya con marcaNombre y categoríaNombre).
 */
class IProductoRepository {
    /**
     * Devuelve todos los productos activos desde la vista aplanada.
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findAllActive() {
        throw new Error('IProductoRepository.findAllActive no implementado.');
    }

    /**
     * Busca un producto “plano” por su ID.
     * @param {number} productoId
     * @returns {Promise<import("../entities/Producto") | null>}
     */
    async findById(productoId) {
        throw new Error('IProductoRepository.findById no implementado.');
    }

    /**
     * Busca productos activos filtrando por marcaId (en la vista plana).
     * @param {number} marcaId
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findByMarca(marcaId) {
        throw new Error('IProductoRepository.findByMarca no implementado.');
    }

    /**
     * Busca productos activos filtrando por categoríaId (en la vista plana).
     * @param {number} categoriaId
     * @returns {Promise<import('../entities/Producto')[]>}
     */
    async findByCategoria(categoriaId) {
        throw new Error('IProductoRepository.findByCategoria no implementado.');
    }
}

module.exports = IProductoRepository;
