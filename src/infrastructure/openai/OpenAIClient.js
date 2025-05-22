const { Configuration, OpenAIApi } = require('openai');

class OpenAIClient {
  constructor({ apiKey, model }) {
    const config = new Configuration({ apiKey });
    this.client = new OpenAIApi(config);
    this.model  = model;
  }

  async extractKeywords(text) {
    const resp = await this.client.createChatCompletion({
      model: this.model,
      messages: [
        { role: 'system', content: 'Extrae hasta 5 palabras clave separadas por comas.' },
        { role: 'user',   content: text }
      ],
      temperature: 0.2
    });
    return resp.data.choices[0].message.content
      .split(/[,\\n]/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  async generateResponse({ userMessage, history, products }) {
    const historyText = history.map(m => `${m.direccion}: ${m.contenido}`).join('\n');
    const productText = products.map(p => `- ${p.nombre} (Bs. ${p.precio}): ${p.descripcion}`).join('\n');
    const systemPrompt = 'Eres un asistente de ventas que recomienda productos según contexto.';
    const userPrompt = `
Historial:
${historyText}

Usuario:
${userMessage}

Productos disponibles:
${productText}
    `;
    const resp = await this.client.createChatCompletion({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt }
      ],
      temperature: 0.7
    });
    return resp.data.choices[0].message.content.trim();
  }
}

module.exports = OpenAIClient;
