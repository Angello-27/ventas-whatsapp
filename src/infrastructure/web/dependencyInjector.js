// src/infrastructure/web/dependencyInjector.js

/**
 * Aquí se instancian todas las implementaciones concretas de repositorios
 * (MySQL + Pinecone), y se exportan en un solo objeto `repos`. También se
 * configura el cliente de OpenAI.
 */

const OpenAIClient = require('../openai/OpenAIClient');

// — MySQL Repositorios —
// Cada uno implementa la interfaz correspondiente en core/repositories
const MysqlClienteRepository = require('../db/MysqlClienteRepository');
const MysqlSesionChatRepository = require('../db/MysqlSesionChatRepository');
const MysqlMensajeRepository = require('../db/MysqlMensajeRepository');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');
const MysqlVarianteRepository = require('../db/MysqlVarianteRepository');
const MysqlPromocionRepository = require('../db/MysqlPromocionRepository');
const MysqlInteresesRepository = require('../db/MysqlInteresesRepository');
const MysqlImagenRepository = require('../db/MysqlImagenRepository');  // <– Repositorio de imágenes

// — Pinecone (vectorial) Repositorios —
// Cada uno implementa la interfaz correspondiente en core/repositories
const PineconeProductoRepository = require('../vector/PineconeProductoRepository');
const PineconeVarianteRepository = require('../vector/PineconeVarianteRepository');
const PineconePromocionRepository = require('../vector/PineconePromocionRepository');
const PineconeInteresesRepository = require('../vector/PineconeInteresesRepository');
// (Si en el futuro añades PineconeImagenRepository, agréguelo aquí)

function buildDeps(openaiConfig) {
    // 1) Instanciamos cada repositorio (MySQL)
    const repos = {
        // MySQL
        clienteRepo: new MysqlClienteRepository(),     // implementa IClienteRepository
        sesionChatRepo: new MysqlSesionChatRepository(),  // implementa ISesionChatRepository
        mensajeRepo: new MysqlMensajeRepository(),     // implementa IMensajeRepository
        productoRepo: new MysqlProductoRepository(),    // implementa IProductoRepository
        varianteRepo: new MysqlVarianteRepository(),    // implementa IVarianteRepository
        promocionRepo: new MysqlPromocionRepository(),   // implementa IPromocionRepository
        interesesRepo: new MysqlInteresesRepository(),   // implementa IInteresesRepository
        imagenRepo: new MysqlImagenRepository(),      // implementa IImagenRepository

        // 2) Instanciamos cada repositorio (Pinecone) para búsquedas vectoriales
        pineProductoRepo: new PineconeProductoRepository(),   // implementa IProductoRepository (vector)
        pineVarianteRepo: new PineconeVarianteRepository(),   // implementa IVarianteRepository (vector)
        pinePromocionRepo: new PineconePromocionRepository(),  // implementa IPromocionRepository (vector)
        pineInteresesRepo: new PineconeInteresesRepository(),  // implementa IInteresesRepository (vector)
        // Si llegas a tener PineconeImagenRepository, agrégalo como “pineImagenRepo” aquí
    };

    // 3) Instanciamos el cliente de OpenAI
    const openaiClient = new OpenAIClient(openaiConfig);

    return { repos, openaiClient };
}

module.exports = { buildDeps };
