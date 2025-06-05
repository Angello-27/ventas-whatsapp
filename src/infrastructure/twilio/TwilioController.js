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


  try {
    // Invocamos tu caso de uso, pasándole solo “repos” y el “openaiClient” (chatClient)
    const reply = await handleIncomingMessage(
      { from, body },
      repos,
      chatClient
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
