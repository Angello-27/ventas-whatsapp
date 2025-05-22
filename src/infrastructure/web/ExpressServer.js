const express = require('express');
const bodyParser = require('body-parser');
const TwilioValidator = require('../twilio/TwilioValidator');
const TwilioController = require('./TwilioController');

class ExpressServer {
  constructor(dbConfig, twilioConfig) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.twilioConfig = twilioConfig;

    // Inicializar repositorios
    const ClienteRepository = require('../db/ClienteRepository');
    const MensajeRepository  = require('../db/MensajeRepository');
    const SesionChatRepository  = require('../db/SesionChatRepository');

    this.repos = {
      customerRepo: new ClienteRepository(),
      sessionRepo : new MensajeRepository(),
      messageRepo : new SesionChatRepository()
    };

    // Middleware y rutas
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.post(
      '/webhook',
      TwilioValidator(this.twilioConfig),
      TwilioController(this.repos, this.twilioConfig)
    );
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

module.exports = ExpressServer;