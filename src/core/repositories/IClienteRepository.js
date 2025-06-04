// core/repositories/IClienteRepository.js

/**
 * Interfaz para acceso a la entidad Cliente.
 * Define los métodos que la capa de infraestructura (MySQL, vector DB, etc.)
 * deberá implementar para crear/leer clientes.
 */
class IClienteRepository {
    /**
     * Busca un cliente por su número de teléfono.
     * @param {string} telefono
     * @returns {Promise<import('../entities/Cliente') | null>}
     */
    async findByTelefono(telefono) {
        throw new Error('IClienteRepository.findByTelefono no implementado.');
    }

    /**
     * Busca un cliente por su ID.
     * @param {number} clienteId
     * @returns {Promise<import('../entities/Cliente') | null>}
     */
    async findById(clienteId) {
        throw new Error('IClienteRepository.findById no implementado.');
    }

    /**
     * Crea un nuevo cliente.
     * @param {{ telefono: string, nombre?: string, email?: string }} data
     * @returns {Promise<import('../entities/Cliente')>}
     */
    async create(data) {
        throw new Error('IClienteRepository.create no implementado.');
    }
}

module.exports = IClienteRepository;
