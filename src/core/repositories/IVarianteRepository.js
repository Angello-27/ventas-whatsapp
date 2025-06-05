// src/core/repositories/IVarianteRepository.js

/**
 * Interfaz para acceso a la vista “vistavariantesproductos”.
 * Define métodos para consultar todas las variantes aplanadas
 * o filtrar por productoId.
 */
class IVarianteRepository {
    /**
     * Devuelve todas las variantes activas “aplanadas” desde la vista.
     * @returns {Promise<import('../entities/Variante')[]>}
     */
    async findAllActive() {
        throw new Error('IVarianteRepository.findAllActive no implementado.');
    }

    /**
     * Devuelve las variantes “aplanadas” de una variante de producto dado.
     * @param {number} varianteId
     * @returns {Promise<import("../entities/Variante") | null>}
     */
    async findById(varianteId) {
        throw new Error('IVarianteRepository.findByProductoId no implementado.');
    }
}

module.exports = IVarianteRepository;
