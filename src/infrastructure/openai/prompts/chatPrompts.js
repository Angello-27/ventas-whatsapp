// src/infrastructure/openai/prompts/chatPrompts.js

/**
 * Toma un texto de conversación (Usuario / Asistente) y devuelve
 * un prompt pidiéndole a OpenAI un resumen breve.
 *
 * @param {string} convoText – Texto con las líneas de conversación a resumir.
 * @returns {string}
 */
module.exports.buildResumenPrompt = function (convoText) {
    return `
Eres un sistema que resume conversaciones de manera concisa. 
A continuación verás interacciones entre Usuario y Asistente.  
Resúmelo en un único párrafo, manteniendo los puntos clave y omitiendo detalles triviales:

### Conversación:
${convoText}
### Fin de conversación.

Resumen:
  `.trim();
};

/**
 * Simple prompt de sistema para indicarle a GPT que actúe como
 * “compactador” de hilos de chat.
 *
 * @returns {string}
 */
module.exports.buildSystemCompactador = function () {
    return 'Eres un compactador de hilos de chat.';
};
