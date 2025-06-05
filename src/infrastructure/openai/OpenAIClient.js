// infrastructure/openai/OpenAIClient.js

const OpenAI = require('openai');

class OpenAIClient {
  constructor({ apiKey, model }) {
    // Instanciamos el cliente con tu clave
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.chatHistory = [];
  }

  // Resetea el hilo si quieres empezar de cero
  resetHistory() {
    this.chatHistory = [];
  }

  // Llamada genérica que incluye todo el historial
  async chat({ systemPrompt, userMessage }) {
    // Prepara la lista de mensajes
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.chatHistory,
      { role: 'user', content: userMessage }
    ];

    // Invoca la API con la v4 llamamos así
    const resp = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7
    });

    const reply = resp.choices[0].message.content.trim();

    // Guardamos en el historial
    this.chatHistory.push({ role: 'user', content: userMessage });
    this.chatHistory.push({ role: 'assistant', content: reply });
    return reply;
  }

  // Nota: en los repositorios vectoriales usamos `embedText`, 
  // pero aquí aún no está definido; deberías agregar algo como:
  // 
  // async embedText(text) {
  //   return await this.client.embeddings.create({
  //     model: this.model,
  //     input: text
  //   });
  // }
  // 
  // para que los repositorios puedan hacer .embedText(text).
}

module.exports = OpenAIClient;
