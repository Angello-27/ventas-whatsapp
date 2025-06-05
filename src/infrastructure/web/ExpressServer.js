// src/infrastructure/web/ExpressServer.js

const express = require('express');
const bodyParser = require('body-parser');
const TwilioValidator = require('../twilio/TwilioValidator');
const TwilioController = require('../twilio/TwilioController');

// En lugar de importar cada repositorio aquí, llamamos a buildDeps:
const { buildDeps } = require('./dependencyInjector');

class ExpressServer {
  constructor(twilioConfig) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.twilioConfig = twilioConfig;

    // 1) Construimos e inyectamos repos + chatClient + embedClient
    const { repos, chatClient } = buildDeps();
    this.repos = repos;
    this.openaiClient = chatClient;

    // Middlewares
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // 2) Definimos la ruta /webhook con validador + controlador
    this.app.post(
      '/webhook',
      TwilioValidator(this.twilioConfig),
      // Aquí le pasamos “repos” y “chatClient” a TwilioController:
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
