// core/entities/Imagen.js

class Imagen {
    /**
     * @param {Object} params
     * @param {number} params.imagenId
     * @param {number} params.varianteId
     * @param {string} params.url
     * @param {boolean} params.esPrincipal
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({
        imagenId,
        varianteId,
        url,
        esPrincipal = false,
        createdAt = null,
        updatedAt = null
    }) {
        this.imagenId = imagenId;
        this.varianteId = varianteId;
        this.url = url;
        this.esPrincipal = esPrincipal;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Imagen;
