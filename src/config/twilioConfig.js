// src/config/twilioConfig.js

/**
 * Parámetros de Twilio para validación y generación de respuestas.
 * authToken: token secreto de Twilio.
 * publicUrl: URL pública donde escucha nuestro webhook.
 */
module.exports = {
  authToken: process.env.TWILIO_AUTH_TOKEN,
  publicUrl: process.env.PUBLIC_URL
};