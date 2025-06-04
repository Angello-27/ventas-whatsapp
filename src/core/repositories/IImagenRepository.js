// core/repositories/IImagenRepository.js

/**
 * Interfaz para acceso a la entidad Imagen (antes ImagenProducto).
 * Permite obtener imágenes asociadas a una variante y marcar la principal.
 */
class IImagenRepository {
    /**
     * Devuelve todas las imágenes de una variante.
     * @param {number} varianteId
     * @returns {Promise<import('../entities/Imagen')[]>}
     */
    async findByVarianteId(varianteId) {
        throw new Error('IImagenRepository.findByVarianteId no implementado.');
    }

    /**
     * Devuelve la imagen principal de una variante (si existe).
     * @param {number} varianteId
     * @returns {Promise<import('../entities/Imagen') | null>}
     */
    async findPrincipalByVariante(varianteId) {
        throw new Error('IImagenRepository.findPrincipalByVariante no implementado.');
    }

    /**
     * Guarda o actualiza una imagen.
     * @param {{ 
     *   imagenId?: number,
     *   varianteId: number,
     *   url: string,
     *   esPrincipal?: boolean 
     * }} data
     * @returns {Promise<import('../entities/Imagen')>}
     */
    async saveOrUpdate(data) {
        throw new Error('IImagenRepository.saveOrUpdate no implementado.');
    }
}

module.exports = IImagenRepository;
