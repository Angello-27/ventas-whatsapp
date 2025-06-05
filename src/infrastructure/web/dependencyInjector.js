// src/infrastructure/web/dependencyInjector.js

/**
 * Instancia todas las implementaciones concretas de repositorios
 * (MySQL + Pinecone), y exporta en un solo objeto `repos`. También
 * crea el cliente de OpenAI y expone esa misma instancia para compartirla.
 */

// 1) Importamos la promesa que al resolver nos da la instancia de Pinecone
const pineconeClientPromise = require('../vector/PineconeClient');;

const { apiKey, chatModel, embedModel } = require('../../config/openaiConfig');

const OpenAIClient = require('../openai/OpenAIClient');

// — MySQL Repositorios —
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

// — Pinecone (vectorial) Repositorios —
const PineconeProductoRepository = require('../vector/PineconeProductoRepository');
// …otros repositorios MySQL y Pinecone…


function buildDeps() {
    // 1) Creamos UNA sola instancia de OpenAIClient para chat:
    const chatClient = new OpenAIClient({
        apiKey: apiKey,
        model: chatModel
    });

    // 2) Creamos UNA sola instancia de OpenAIClient para embeddings:
    const embedClient = new OpenAIClient({
        apiKey: apiKey,
        model: embedModel
    });

    // 3) Instanciamos repositorios MySQL
    const mysqlRepos = {
        productoRepo: new MysqlProductoRepository()
        // … aquí puedes agregar clienteRepo, sesionChatRepo, mensajeRepo, etc.
    };

    // 4) Repositorios Pinecone: pasamos la *promesa* pineconeClientPromise
    const pineconeRepos = {
        pineProductoRepo: new PineconeProductoRepository(pineconeClientPromise, embedClient)
        // … aquí agregarías pineVarianteRepo, pinePromocionRepo, etc., todos con (pinecone, embedClient)
    };

    return {
        repos: {
            ...mysqlRepos,
            ...pineconeRepos
        },
        chatClient,   // para manejar conversaciones
        embedClient,   // para generar embeddings
        pineconeRepos // Exponemos solo el grupo Pinecone para sincronizar más tarde
    };
}

module.exports = { buildDeps };
