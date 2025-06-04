// core/repositories/IMensajeRepository.js

/**
 * Interfaz para acceso a la entidad Mensaje.
 * Permite guardar mensajes entrantes/salientes y recuperar el historial de la sesión.
 */
class IMensajeRepository {
    /**
     * Guarda un mensaje en la base de datos.
     * @param {{ 
     *   sesionId: number,
     *   direccion: 'Entrante' | 'Saliente',
     *   contenido: string 
     * }} data
     * @returns {Promise<import('../entities/Mensaje')>}
     */
    async save(data) {
        throw new Error('IMensajeRepository.save no implementado.');
    }

    /**
     * Recupera todos los mensajes de una sesión (entrantes y salientes),
     * ordenados cronológicamente.
     * @param {number} sesionId
     * @returns {Promise<import('../entities/Mensaje')[]>}
     */
    async findBySesionId(sesionId) {
        throw new Error('IMensajeRepository.findBySesionId no implementado.');
    }
}

module.exports = IMensajeRepository;
