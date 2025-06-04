// core/entities/Intereses.js

class Intereses {
    /**
     * @param {Object} params
     * @param {number} params.interesId
     * @param {number} params.clienteId
     * @param {string} params.intereses     // por ejemplo: "Nike,Poleras,Shorts"
     * @param {Date|null} params.createdAt
     * @param {Date|null} params.updatedAt
     */
    constructor({ interesId, clienteId, intereses, createdAt = null, updatedAt = null }) {
        this.interesId = interesId;
        this.clienteId = clienteId;
        this.intereses = intereses;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Intereses;
