// index.js

require('dotenv').config();

const ExpressServer = require('./infrastructure/web/ExpressServer');
const twilioConfig = require('./config/twilioConfig');

// Ya no necesitamos importar PineconeClient aquí, porque lo hacemos
// indirecamente cuando dependencyInjector lo requiera.
const server = new ExpressServer(twilioConfig);
server.start();

