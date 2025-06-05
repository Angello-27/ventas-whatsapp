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
}

module.exports = IProductoRepository;
