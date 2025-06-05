// src/core/repositories/IMensajeRepository.js

/**
 * Interfaz para acceso a la entidad Mensaje.
 * Permite guardar mensajes y recuperar el historial de una sesión.
 */
class IMensajeRepository {
    /**
     * Guarda un mensaje (entrante o saliente) en la sesión correspondiente.
     * @param {{ sesionId: number, direccion: 'Entrante'|'Saliente', contenido: string }} data
     * @returns {Promise<import('../entities/Mensaje')>}
     */
    async save(data) {
        throw new Error('IMensajeRepository.save no implementado.');
    }

    /**
     * Recupera todos los mensajes activos de una sesión, ordenados por fecha.
     * @param {number} sesionId
     * @returns {Promise<import('../entities/Mensaje')[]>}
     */
    async findBySesionId(sesionId) {
        throw new Error('IMensajeRepository.findBySesionId no implementado.');
    }
}

module.exports = IMensajeRepository;
