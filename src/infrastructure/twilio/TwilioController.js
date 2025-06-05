// infrastructure/web/TwilioController.js

const { MessagingResponse } = require('twilio').twiml;
const handleIncomingMessage = require('../../core/usecases/handleIncomingMessage');
const { processMessage } = require('../../core/usecases/services/chatService');

// Map simple en memoria: { '5917xxxxxxx': 'resumen...' }
const userHistories = {};

/**
 * Controlador HTTP para /webhook
 * Solo necesita repos y usa handleIncomingMessage
 */
module.exports = (repos, chatClient) => async (req, res) => {
  // 1) Extraer número y texto
  const from = (req.body.From || '').replace(/^whatsapp:/, '');
  const body = req.body.Body || '';


  try {
    // 2) Delegar toda la lógica de cliente/sesión/mensajes al ChatService
    //    El use case handleIncomingMessage será llamado desde dentro de processMessage.
    const reply = await processMessage(
      { from, body },
      repos,
      chatClient,
      handleIncomingMessage
    );

    // 3) Enviar la respuesta a Twilio
    const twiml = new MessagingResponse();
    twiml.message(reply);
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).send('Server error');
  }
};
