// infrastructure/web/TwilioController.js

const { MessagingResponse } = require('twilio').twiml;
const handleIncomingMessage = require('../../core/usecases/handleIncomingMessage');

// Map simple en memoria: { '5917xxxxxxx': 'resumen...' }
const userHistories = {};

/**
 * Controlador HTTP para /webhook
 * Solo necesita repos y usa handleIncomingMessage
 */
module.exports = (repos, chatClient) => async (req, res) => {
  const from = (req.body.From || '').replace(/^whatsapp:/, '');
  const body = req.body.Body || '';

  // Recuperar el historial previo (o cadena vacía si no existe)
  const convoHistory = userHistories[from] || '';

  try {
    // Invocamos tu caso de uso, pasándole solo “repos” y el “openaiClient” (chatClient)
    const reply = await handleIncomingMessage(
      { from, body },
      repos,
      chatClient,
      convoHistory
    );

    // Aquí podrías actualizar userHistories[from]:
    // Por simplicidad, guardamos el mensaje completo del cliente + primera línea de la respuesta
    // (En producción, querrías resumir con buildResumenPrompt tras N intercambios).
    const nuevaLineaHistoria = `Usuario: ${body}\nAsistente: ${reply.split('\n')[0]}`;
    // Concatenamos y, opcionalmente, podríamos recortar para no crecer indefinidamente:
    userHistories[from] = convoHistory
      ? convoHistory + ' ' + nuevaLineaHistoria
      : nuevaLineaHistoria;

    const twiml = new MessagingResponse();
    twiml.message(reply);
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).send('Server error');
  }
};
