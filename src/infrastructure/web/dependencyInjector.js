// src/infrastructure/web/dependencyInjector.js

/**
 * Instancia todas las implementaciones concretas de repositorios
 * (MySQL + Pinecone), y exporta en un solo objeto `repos`. También
 * crea el cliente de OpenAI y expone esa misma instancia para compartirla.
 */

// 1) Importar PineconeClient para inicializar el índice
const pinecone = require('../vector/PineconeClient');

const OpenAIClient = require('../openai/OpenAIClient');

// — MySQL Repositorios —
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

// — Pinecone (vectorial) Repositorios —
const PineconeProductoRepository = require('../vector/PineconeProductoRepository');
// …otros repositorios MySQL y Pinecone…


function buildDeps(openaiConfig) {
    // 1) Creamos UNA sola instancia del cliente de OpenAI
    const openaiClient = new OpenAIClient(openaiConfig);

    // 2) Ya tenemos UNA sola instancia de Pinecone (por el require('../vector/PineconeClient'))

    // 3) Instanciamos repositorios MySQL
    const mysqlRepos = {
        productoRepo: new MysqlProductoRepository()
    };

    // 4) Instanciamos repositorios Pinecone, inyectando las instancias de pinecone y openaiClient:
    const pineconeRepos = {
        pineProductoRepo: new PineconeProductoRepository(pinecone, openaiClient)
        // Si tuvieras PineconeImagenRepository, pasas los mismos argumentos ahí:
    };

    return {
        repos: {
            ...mysqlRepos,
            ...pineconeRepos
        },
        openaiClient
    };
}

module.exports = { buildDeps };
