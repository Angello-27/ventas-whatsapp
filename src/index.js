require('dotenv').config();
const ExpressServer = require('./infrastructure/web/ExpressServer');
const twilioConfig  = require('./config/twilioConfig');

// Inicializa y arranca el servidor Express
const server = new ExpressServer(twilioConfig);
server.start();