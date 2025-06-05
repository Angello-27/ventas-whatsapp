// infrastructure/twilio/TwilioValidator.js

const twilio = require('twilio');

module.exports = (twilioConfig) => (req, res, next) => {
  const signature = req.headers['x-twilio-signature'];
  const url = twilioConfig.publicUrl + req.originalUrl;
  if (!twilio.validateRequest(twilioConfig.authToken, signature, url, req.body)) {
    return res.status(403).send('Invalid Twilio signature');
  }
  next();
};
