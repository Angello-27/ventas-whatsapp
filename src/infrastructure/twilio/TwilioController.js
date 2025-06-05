// infrastructure/web/TwilioController.js

const { MessagingResponse } = require('twilio').twiml;
const handleIncomingMessage = require('../../core/usecases/handleIncomingMessage');

/**
 * Controlador HTTP para /webhook
 * Solo necesita repos y usa handleIncomingMessage
 */
module.exports = (repos, openaiClient) => async (req, res) => {
  // Twilio envía el campo From como "whatsapp:+5917xxxxxxx"
  const from = req.body.From || '';
  const body = req.body.Body;

  // Opcional: extraer solo el número sin el prefijo “whatsapp:”
  const plainNumber = from.replace(/^whatsapp:/, '');

  try {
    // Invocamos tu caso de uso, pasándole solo “repos” y el “openaiClient” (chatClient)
    const reply = await handleIncomingMessage(
      { from: plainNumber, body },
      repos,
      openaiClient
    );

    const twiml = new MessagingResponse();
    twiml.message(reply);
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).send('Server error');
  }
};
