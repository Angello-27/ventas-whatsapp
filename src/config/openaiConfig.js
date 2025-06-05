// config/openaiConfig.js

/**
 * Configuración para el cliente de OpenAI:
 * - apiKey: tu clave privada, en OPENAI_API_KEY
 * - chatModel: modelo para chat completions (por defecto gpt-3.5-turbo)
 * - embedModel: modelo para embeddings (por defecto text-embedding-ada-002)
 */
module.exports = {
  apiKey: process.env.OPENAI_API_KEY,
  chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-3.5-turbo',
  embedModel: process.env.OPENAI_EMBED_MODEL || 'text-embedding-ada-002'
};
