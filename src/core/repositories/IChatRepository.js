// src/core/repositories/IChatRepository.js

const IClienteRepository = require('./IClienteRepository');
const ISesionRepository = require('./ISesionRepository');
const IMensajeRepository = require('./IMensajeRepository');

/**
 * Interfaz combinada para operaciones de chat.
 * Extiende las tres interfaces: Cliente, Sesion y Mensaje.
 * Esto facilita la inyección de dependencias y el uso en los casos de uso.
 */
class IChatRepository extends IClienteRepository {
    constructor() {
        super();

        // Mezclamos las interfaces de Sesion y Mensaje
        Object.assign(this, new ISesionRepository());
        Object.assign(this, new IMensajeRepository());
    }
}

module.exports = IChatRepository;