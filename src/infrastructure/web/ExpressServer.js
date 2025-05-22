const express = require('express');
const bodyParser = require('body-parser');
const TwilioValidator = require('../twilio/TwilioValidator');
const TwilioController = require('./TwilioController');

class ExpressServer {
  constructor(twilioConfig, openaiConfig) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.twilioConfig = twilioConfig;

    // Inicializa repositorios con el orden correcto
    const ClienteRepository = require('../db/ClienteRepository');
    const SesionChatRepository = require('../db/SesionChatRepository');
    const MensajeRepository = require('../db/MensajeRepository');

    const VistaCampanaAmbitoRepository = require('../db/VistaCampanaAmbitoRepository');
    const VistaCampanaItemsRepository = require('../db/VistaCampanaItemsRepository');
    const VistaEnvaseInfoRepository = require('../db/VistaEnvaseInfoRepository');
    const VistaItemOrdenFullRepository = require('../db/VistaItemOrdenFullRepository');
    const VistaProductoHierarchyRepository = require('../db/VistaProductoHierarchyRepository');
    const VistaStockPrecioRepository = require('../db/VistaStockPrecioRepository');
    const VistaChatFullRepository = require('../db/VistaChatFullRepository');

    // Cliente OpenAI
    const OpenAIClient = require('../openai/OpenAIClient');

    this.repos = {
      clienteRepo: new ClienteRepository(),
      sesionChatRepo: new SesionChatRepository(),
      mensajeRepo: new MensajeRepository(),

      chatFullRepo: new VistaChatFullRepository(),
      campanaAmbitoRepo: new VistaCampanaAmbitoRepository(),
      campanaItemsRepo: new VistaCampanaItemsRepository(),
      envaseInfoRepo: new VistaEnvaseInfoRepository(),
      itemOrdenFullRepo: new VistaItemOrdenFullRepository(),
      productoHierarchyRepo: new VistaProductoHierarchyRepository(),
      stockPrecioRepo: new VistaStockPrecioRepository(),
    };

    this.openaiClient = new OpenAIClient(openaiConfig);

    // Middlewares
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Ruta /webhook con validación de firma y controlador
    this.app.post(
      '/webhook',
      TwilioValidator(this.twilioConfig),
      TwilioController(this.repos, this.openaiClient)
    );
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

module.exports = ExpressServer;