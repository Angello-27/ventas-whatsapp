// src/infrastructure/openai/OpenAIClient.js

const OpenAI = require('openai');
// Ahora importamos el resumen y compactador desde chatPrompts.js
const {
  buildResumenPrompt,
  buildSystemCompactador
} = require('./prompts/chatPrompts');

class OpenAIClient {
  /**
   * @param {{ apiKey: string, model: string }} options
   */
  constructor({ apiKey, model }) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.chatHistory = [];
    this.maxHistoryPairs = 4; // máximo de pares usuario+asistente
  }

  resetHistory() {
    this.chatHistory = [];
  }

  /**
   * Si el historial de conversación excede maxHistoryPairs * 2 mensajes,
   * resumimos las partes más antiguas usando buildResumenPrompt + buildSystemCompactador.
   */
  async _ensureHistorySize() {
    const maxItems = this.maxHistoryPairs * 2;
    if (this.chatHistory.length <= maxItems) return;

    // 1) Dividimos: mensajes antiguos a resumir vs los más recientes
    const sliceToSummarize = this.chatHistory.slice(0, this.chatHistory.length - maxItems);
    const remaining = this.chatHistory.slice(this.chatHistory.length - maxItems);

    // 2) Construimos el texto completo que vamos a resumir
    let convoText = '';
    for (const msg of sliceToSummarize) {
      const prefix = msg.role === 'user' ? 'Usuario: ' : 'Asistente: ';
      convoText += prefix + msg.content + '\n';
    }

    // 3) Generamos el prompt para que GPT resuma esas líneas
    const resumenPrompt = buildResumenPrompt(convoText);
    const systemCompact = buildSystemCompactador();

    // 4) Llamamos a la API de OpenAI para resumir
    const resp = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemCompact },
        { role: 'user', content: resumenPrompt }
      ],
      temperature: 0.3
    });

    const summaryText = resp.choices[0].message.content.trim();

    // 5) Reemplazamos todos los mensajes antiguos por uno solo con el resumen
    this.chatHistory = [
      { role: 'assistant', content: `Resumen previo: ${summaryText}` },
      ...remaining
    ];
  }

  /**
   * Envía un chat a OpenAI, incluye el prompt de sistema, el historial resumido
   * y el mensaje actual del usuario. Luego almacena la respuesta al historial.
   *
   * @param {{ systemPrompt: string, userMessage: string }} params
   * @returns {Promise<string>} – respuesta del asistente
   */
  async chat({ systemPrompt, userMessage }) {
    // 1) Antes de construir la lista completa de mensajes, 
    // nos aseguramos de resumir si el historial es muy largo:
    await this._ensureHistorySize();

    // 2) Construir el array de mensajes a enviar:
    //    - Primero el prompt de sistema (contiene todas las reglas)
    //    - Luego el historial (pares user/assistant ya resumidos si hacía falta)
    //    - Finalmente el mensaje actual del usuario
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.chatHistory,
      { role: 'user', content: userMessage }
    ];

    // 3) Llamar a la API de completions tipo chat
    const resp = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7
    });

    const reply = resp.choices[0].message.content.trim();

    // 4) Guardar el nuevo par (usuario + asistencia) en el historial
    this.chatHistory.push({ role: 'user', content: userMessage });
    this.chatHistory.push({ role: 'assistant', content: reply });

    return reply;
  }

  /**
   * Genera un embedding para el texto dado.
   * @param {string} text
   * @returns {Promise<*>} – respuesta cruda de embeddings.create()
   */
  async embedText(text) {
    const resp = await this.client.embeddings.create({
      model: this.model,   // por ejemplo: "text-embedding-ada-002"
      input: text
    });
    return resp;
  }
}

module.exports = OpenAIClient;
