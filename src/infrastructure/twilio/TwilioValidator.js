const twilio = require('twilio');

module.exports = (twilioConfig) => (req, res, next) => {
  console.log('🔐 TwilioValidator: Validando request...');

  const signature = req.headers['x-twilio-signature'];
  const url = twilioConfig.publicUrl + req.originalUrl;

  console.log('📋 Validator data:', {
    signature: signature ? 'presente' : 'ausente',
    url,
    hasBody: !!req.body,
    authToken: twilioConfig.authToken ? 'configurado' : 'faltante'
  });

  if (!signature) {
    console.error('❌ Signature faltante en headers');
    return res.status(403).send('Missing Twilio signature');
  }

  if (!twilioConfig.authToken) {
    console.error('❌ Auth token no configurado');
    return res.status(500).send('Server configuration error');
  }

  const isValid = twilio.validateRequest(
    twilioConfig.authToken,
    signature,
    url,
    req.body
  );

  if (!isValid) {
    console.error('❌ Invalid Twilio signature:', {
      expectedUrl: url,
      receivedSignature: signature
    });
    return res.status(403).send('Invalid Twilio signature');
  }

  console.log('✅ Twilio signature válida');
  next();
};