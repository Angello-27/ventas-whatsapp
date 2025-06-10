// src/infrastructure/web/dependencyInjector.js

/**
 * Instancia todas las implementaciones concretas de repositorios
 * (MySQL + Pinecone), y exporta en un solo objeto `repos`.
 * También crea el cliente de OpenAI para chat y embeddings,
 * y expone esa misma instancia para compartirla.
 */

// 1) Promesa de cliente Pinecone inicializado
const pineconeClientPromise = require('../vector/PineconeClient');

// 2) Configuración de OpenAI
const { apiKey, chatModel, embedModel } = require('../../config/openaiConfig');
const OpenAIClient = require('../openai/OpenAIClient');

// — MySQL Repositorios —
const MysqlProductoRepository = require('../db/MysqlProductoRepository');
const MysqlVarianteRepository = require('../db/MysqlProductoVarianteRepository');
const MysqlPromocionRepository = require('../db/MysqlPromocionRepository');
const MysqlPromocionProductoRepository = require('../db/MysqlPromocionProductoRepository');

// — Pinecone (vectorial) Repositorios —
//const PineconeProductoRepository = require('../vector/PineconeProductoRepository');
const PineconeVarianteRepository = require('../vector/PineconeVarianteRepository');
//const PineconePromocionRepository = require('../vector/PineconePromocionRepository');
//const PineconePromocionProductoRepository = require('../vector/PineconePromocionProductoRepository');

function buildDeps() {
    // 1) Cliente de chat (OpenAI Chat)
    const chatClient = new OpenAIClient({
        apiKey: apiKey,
        model: chatModel
    });

    // 2) Cliente de embeddings (OpenAI Embeddings)
    const embedClient = new OpenAIClient({
        apiKey: apiKey,
        model: embedModel
    });

    // 3) Instanciamos repositorios MySQL (vistas planas)
    const mysqlRepos = {
        productoRepo: new MysqlProductoRepository(),
        varianteRepo: new MysqlVarianteRepository(),
        promocionRepo: new MysqlPromocionRepository(),
        promocionProductoRepo: new MysqlPromocionProductoRepository()
        // … agregar otros repositorios MySQL según necesidad …
    };

    // 4) Instanciamos repositorios Pinecone (vectorial)
    const pineconeRepos = {
        //pinePromocionProductoRepo: new PineconePromocionProductoRepository(pineconeClientPromise, embedClient),
        //pinePromocionRepo: new PineconePromocionRepository(pineconeClientPromise, embedClient),
        //pineProductoRepo: new PineconeProductoRepository(pineconeClientPromise, embedClient),
        pineVarianteRepo: new PineconeVarianteRepository(pineconeClientPromise, embedClient),
        // … agregar otros repositorios Pinecone según necesidad …
    };

    return {
        repos: {
            // combinamos Repos MySQL + Pinecone en un solo objeto
            ...mysqlRepos,
            ...pineconeRepos
        },
        chatClient,    // cliente OpenAI para chat
        embedClient,   // cliente OpenAI para embeddings
        pineconeRepos  // grupo de repositorios Pinecone para sincronizar
    };
}

module.exports = { buildDeps };
