// infrastructure/web/TwilioController.js

const { MessagingResponse } = require('twilio').twiml;
const handleIncomingMessage = require('../../core/usecases/handleIncomingMessage');

/**
 * Controlador HTTP para /webhook
 * Solo necesita repos y usa handleIncomingMessage
 */
module.exports = (repos, openaiClient) => async (req, res) => {
  // Twilio envía el campo From como "whatsapp:+5917xxxxxxx"
  const rawFrom = req.body.From || '';
  // Eliminamos el prefijo "whatsapp:" (si existe)
  const from = rawFrom.startsWith('whatsapp:')
    ? rawFrom.split(':')[1]
    : rawFrom;

  const body = req.body.Body;

  try {
    // Ahora `from` contendrá solamente "+59175505343"
    const reply = await handleIncomingMessage(
      { from, body },
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
