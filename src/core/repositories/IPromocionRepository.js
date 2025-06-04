// core/repositories/IPromocionRepository.js

/**
 * Interfaz para acceso a la entidad Promocion.
 * Incluye métodos para obtener promociones activas, filtrar por producto, etc.
 */
class IPromocionRepository {
    /**
     * Devuelve todas las promociones activas (today entre inicio y fin).
     * @returns {Promise<import('../entities/Promocion')[]>}
     */
    async findAllActive() {
        throw new Error('IPromocionRepository.findAllActive no implementado.');
    }

    /**
     * Devuelve promociones activas que apliquen a cierto producto (por productoId).
     * @param {number} productoId
     * @returns {Promise<import('../entities/Promocion')[]>}
     */
    async findActiveByProductoId(productoId) {
        throw new Error('IPromocionRepository.findActiveByProductoId no implementado.');
    }

    /**
     * Devuelve promociones activas que apliquen a cierta categoría.
     * @param {number} categoriaId
     * @returns {Promise<import('../entities/Promocion')[]>}
     */
    async findActiveByCategoriaId(categoriaId) {
        throw new Error('IPromocionRepository.findActiveByCategoriaId no implementado.');
    }
}

module.exports = IPromocionRepository;
