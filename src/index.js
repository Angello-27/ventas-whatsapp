require('dotenv').config();
const ExpressServer = require('./infrastructure/web/ExpressServer');
const dbConfig       = require('./config/dbConfig');
const twilioConfig   = require('./config/twilioConfig');

// Inicializa y arranca el servidor Express
const server = new ExpressServer(dbConfig, twilioConfig);
server.start();