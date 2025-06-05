// src/core/repositories/IClienteRepository.js

/**
 * Interfaz para acceso a la entidad Cliente.
 * Define métodos para buscar y crear clientes.
 */
class IClienteRepository {
    /**
     * Busca un cliente por su teléfono (sin prefijo “whatsapp:”).
     * @param {string} telefono
     * @returns {Promise<import('../entities/Cliente') | null>}
     */
    async findByTelefono(telefono) {
        throw new Error('IClienteRepository.findByTelefono no implementado.');
    }

    /**
     * Crea un nuevo cliente con los datos proporcionados.
     * @param {{ nombre: string|null, telefono: string, email: string|null }} data
     * @returns {Promise<import('../entities/Cliente')>}
     */
    async create(data) {
        throw new Error('IClienteRepository.create no implementado.');
    }
}

module.exports = IClienteRepository;
