// src/infrastructure/web/ExpressServer.js

const express = require('express');
const bodyParser = require('body-parser');
const TwilioValidator = require('../twilio/TwilioValidator');
const TwilioController = require('../twilio/TwilioController');

// En lugar de importar cada repositorio aquí, llamamos a buildDeps:
const { buildDeps } = require('./dependencyInjector');

class ExpressServer {
  constructor(twilioConfig, openaiConfig) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.twilioConfig = twilioConfig;

    // Construimos e inyectamos repositorios + cliente OpenAI
    const { repos, openaiClient } = buildDeps(openaiConfig);
    this.repos = repos;
    this.openaiClient = openaiClient;

    // Middlewares
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Ruta /webhook
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
