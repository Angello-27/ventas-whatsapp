const { MessagingResponse } = require('twilio').twiml;
const handleIncomingMessage = require('../../core/usecases/handleIncomingMessage');

module.exports = (repos, twilioConfig) => async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;
  try {
    const reply = await handleIncomingMessage({ from, body }, repos);
    const twiml = new MessagingResponse();
    twiml.message(reply);
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).send('Server error');
  }
};