/**
 * Configuración para el cliente de OpenAI. Tu clave privada de OpenAI, que debe
 * estar definida en la variable de entorno OPENAI_API_KEY.
 *
 * El identificador del modelo de lenguaje que quieres usar. Lee de OPENAI_MODEL si
 * está definido, o usa 'gpt-3.5-turbo' por defecto.
 */

module.exports = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
};
