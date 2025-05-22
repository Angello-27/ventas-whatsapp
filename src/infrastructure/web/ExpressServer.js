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
    const MySQLCustomerRepository = require('../db/MySQLCustomerRepository');
    const MySQLSessionRepository  = require('../db/MySQLSessionRepository');
    const MySQLMessageRepository  = require('../db/MySQLMessageRepository');

    this.repos = {
      customerRepo: new MySQLCustomerRepository(),
      sessionRepo : new MySQLSessionRepository(),
      messageRepo : new MySQLMessageRepository()
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