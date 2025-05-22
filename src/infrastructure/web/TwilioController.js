const { MessagingResponse } = require('twilio').twiml;
const handleIncomingMessage = require('../../core/usecases/handleIncomingMessage');

/**
 * Controlador HTTP para /webhook
 * Solo necesita repos y usa handleIncomingMessage
 */
module.exports = (repos, openaiClient) => async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  try {
    // Llamamos al use case pasando también openaiClient
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