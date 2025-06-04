// core/repositories/IVarianteRepository.js

/**
 * Interfaz para acceso a la entidad Variante.
 * Contiene métodos para obtener variantes por ID o por producto.
 */
class IVarianteRepository {
    /**
     * Devuelve todas las variantes de un producto.
     * @param {number} productoId
     * @returns {Promise<import('../entities/Variante')[]>}
     */
    async findByProductoId(productoId) {
        throw new Error('IVarianteRepository.findByProductoId no implementado.');
    }

    /**
     * Busca una variante por su ID.
     * @param {number} varianteId
     * @returns {Promise<import('../entities/Variante') | null>}
     */
    async findById(varianteId) {
        throw new Error('IVarianteRepository.findById no implementado.');
    }

    /**
     * Guarda o actualiza una variante.
     * @param {{ 
     *   varianteId?: number,
     *   productoId: number,
     *   color: string,
     *   talla: string,
     *   material?: string,
     *   sku: string,
     *   precioVenta: number,
     *   cantidad: number,
     *   isActive?: boolean 
     * }} data
     * @returns {Promise<import('../entities/Variante')>}
     */
    async saveOrUpdate(data) {
        throw new Error('IVarianteRepository.saveOrUpdate no implementado.');
    }
}

module.exports = IVarianteRepository;
