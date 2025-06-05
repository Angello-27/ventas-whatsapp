// src/infrastructure/openai/OpenAIClient.js

const OpenAI = require('openai');
const {
  buildResumenPrompt,
  buildSystemCompactador
} = require('./prompts/chatPrompts');

class OpenAIClient {
  constructor({ apiKey, model }) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.chatHistory = [];
    this.maxHistoryPairs = 10; // máximo de pares usuario+asistente
  }

  resetHistory() {
    this.chatHistory = [];
  }

  async _ensureHistorySize() {
    const maxItems = this.maxHistoryPairs * 2;
    if (this.chatHistory.length <= maxItems) return;

    // Extraer los mensajes antiguos a resumir
    const sliceToSummarize = this.chatHistory.slice(0, this.chatHistory.length - maxItems);

    // Construir el texto completo de esa parte de la conversación
    let convoText = '';
    for (const msg of sliceToSummarize) {
      convoText += (msg.role === 'user' ? 'Usuario: ' : 'Asistente: ')
        + msg.content + '\n';
    }

    // Generar el prompt para resumen
    const resumenPrompt = buildResumenPrompt(convoText);
    const systemCompact = buildSystemCompactador();

    // Llamada a OpenAI para resumir
    const resp = await this.client.chat.completions.create({
      model: this.model, // p.ej. "gpt-3.5-turbo"
      messages: [
        { role: 'system', content: systemCompact },
        { role: 'user', content: resumenPrompt }
      ],
      temperature: 0.3
    });

    const summaryText = resp.choices[0].message.content.trim();

    // Reemplazar los mensajes antiguos por un solo mensaje “Resumen previo: …”
    const remaining = this.chatHistory.slice(sliceToSummarize.length);
    this.chatHistory = [
      { role: 'assistant', content: `Resumen previo: ${summaryText}` },
      ...remaining
    ];
  }

  /**
   * Envía un chat a OpenAI y gestiona el historial, resumiendo si es muy largo.
   * @param {{ systemPrompt: string, userMessage: string }} params
   */
  async chat({ systemPrompt, userMessage }) {
    // Construir la lista de mensajes completa
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.chatHistory,
      { role: 'user', content: userMessage }
    ];

    // Asegurar que el historial no exceda el tamaño máximo
    await this._ensureHistorySize();

    // Llamar a la API de chat completions
    const resp = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7
    });

    const reply = resp.choices[0].message.content.trim();

    // Guardar en el historial
    this.chatHistory.push({ role: 'user', content: userMessage });
    this.chatHistory.push({ role: 'assistant', content: reply });
    return reply;
  }

  /**
   * Genera un embedding para el texto dado.
   * @param {string} text
   */
  async embedText(text) {
    const resp = await this.client.embeddings.create({
      model: this.model,   // p.ej. "text-embedding-ada-002"
      input: text
    });
    return resp;
  }
}

module.exports = OpenAIClient;
