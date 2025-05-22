const express          = require('express');
const bodyParser       = require('body-parser');
const TwilioValidator  = require('../twilio/TwilioValidator');
const TwilioController = require('./TwilioController');

class ExpressServer {
  constructor(twilioConfig) {
    this.app         = express();
    this.port        = process.env.PORT || 3000;
    this.twilioConfig = twilioConfig;

    // Inicializa repositorios con el orden correcto
    const ClienteRepository    = require('../db/ClienteRepository');
    const SesionChatRepository = require('../db/SesionChatRepository');
    const MensajeRepository    = require('../db/MensajeRepository');

    this.repos = {
      clienteRepo: new ClienteRepository(),
      sesionChatRepo : new SesionChatRepository(),
      mensajeRepo : new MensajeRepository()
    };

    // Middlewares
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Ruta /webhook con validación de firma y controlador
    this.app.post(
      '/webhook',
      TwilioValidator(this.twilioConfig),
      TwilioController(this.repos)
    );
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

module.exports = ExpressServer;