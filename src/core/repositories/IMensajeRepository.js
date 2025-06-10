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
    async saveMessage(data) { // ✅ Cambiar de save a saveMessage para consistencia
        throw new Error('IMensajeRepository.saveMessage no implementado.');
    }

    /**
     * Recupera todos los mensajes activos de una sesión, ordenados por fecha.
     * @param {number} sesionId
     * @returns {Promise<import('../entities/Mensaje')[]>}
     */
    async findMessagesBySesionId(sesionId) { // ✅ Cambiar para consistencia
        throw new Error('IMensajeRepository.findMessagesBySesionId no implementado.');
    }
}

module.exports = IMensajeRepository;