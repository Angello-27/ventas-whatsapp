require('dotenv').config();
const ExpressServer = require('./infrastructure/web/ExpressServer');
const twilioConfig = require('./config/twilioConfig');
const openaiConfig = require('./config/openaiConfig');

// Inicializa y arranca el servidor Express
const server = new ExpressServer(twilioConfig, openaiConfig);
server.start();