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
const MysqlClienteRepository = require('../db/MysqlClienteRepository');
const MysqlSesionChatRepository = require('../db/MysqlSesionChatRepository');
const MysqlMensajeRepository = require('../db/MysqlMensajeRepository');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');
const MysqlVarianteRepository = require('../db/MysqlVarianteRepository');
const MysqlPromocionRepository = require('../db/MysqlPromocionRepository');
const MysqlInteresesRepository = require('../db/MysqlInteresesRepository');
const MysqlImagenRepository = require('../db/MysqlImagenRepository');

// — Pinecone (vectorial) Repositorios —
const PineconeProductoRepository = require('../vector/PineconeProductoRepository');
const PineconeVarianteRepository = require('../vector/PineconeVarianteRepository');
const PineconePromocionRepository = require('../vector/PineconePromocionRepository');
// (Si en el futuro añades PineconeImagenRepository, agréguelo aquí)


function buildDeps(openaiConfig) {
    // 1) Creamos UNA sola instancia del cliente de OpenAI
    const openaiClient = new OpenAIClient(openaiConfig);

    // 2) Ya tenemos UNA sola instancia de Pinecone (por el require('../vector/PineconeClient'))
    //    que se inicializó al cargar este módulo.

    // 3) Instanciamos repositorios MySQL
    const mysqlRepos = {
        clienteRepo: new MysqlClienteRepository(),
        sesionChatRepo: new MysqlSesionChatRepository(),
        mensajeRepo: new MysqlMensajeRepository(),
        productoRepo: new MysqlProductoRepository(),
        varianteRepo: new MysqlVarianteRepository(),
        promocionRepo: new MysqlPromocionRepository(),
        interesesRepo: new MysqlInteresesRepository(),
        imagenRepo: new MysqlImagenRepository()
    };

    // 4) Instanciamos repositorios Pinecone, inyectando las instancias de pinecone y openaiClient:
    const pineconeRepos = {
        pineProductoRepo: new PineconeProductoRepository(pinecone, openaiClient),
        pineVarianteRepo: new PineconeVarianteRepository(pinecone, openaiClient),
        pinePromocionRepo: new PineconePromocionRepository(pinecone, openaiClient)
        // Si tuvieras PineconeImagenRepository, pasas los mismos argumentos ahí:
        // pineImagenRepo: new PineconeImagenRepository(pinecone, openaiClient)
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
