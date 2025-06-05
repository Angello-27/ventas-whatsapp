// src/infrastructure/vector/PineconePromocionRepository.js

const { PineconeClient } = require('@pinecone-database/pinecone');
const pineconeConfig = require('../../config/pineconeConfig');
const OpenAIClient = require('../../openai/OpenAIClient');
const MysqlPromocionRepository = require('../db/MysqlPromocionRepository');

class PineconePromocionRepository {
    constructor() {
        this.pinecone = new PineconeClient();
        this.openaiClient = new OpenAIClient({
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || 'text-embedding-ada-002'
        });
        this.init();
    }

    async init() {
        await this.pinecone.init({
            apiKey: pineconeConfig.apiKey,
            environment: pineconeConfig.environment
        });
        const existing = await this.pinecone.listIndexes();
        if (!existing.includes(pineconeConfig.indexName)) {
            await this.pinecone.createIndex({
                createRequest: {
                    name: pineconeConfig.indexName,
                    dimension: 1536,
                    metric: 'cosine'
                }
            });
        }
        this.index = this.pinecone.Index(pineconeConfig.indexName);
    }

    /**
     * Reindexa todas las promociones activas: genera un embedding a partir
     * del título + descripción + descuento, y hace upsert en namespace="promociones".
     */
    async syncAllToVectorDB() {
        const mysqlRepo = new MysqlPromocionRepository();
        const promos = await mysqlRepo.findAllActive();
        // findAllActive() debería devolver:
        // [ { promocionId, titulo, descripcion, descuentoPct, fechaInicio, fechaFin, … }, … ]

        const vectors = [];
        for (const promo of promos) {
            const textToEmbed = `${promo.titulo}: ${promo.descripcion || ''} (-${promo.descuentoPct}%)`;
            const embeddingResponse = await this.openaiClient.embedText(textToEmbed);
            const vectorValues = embeddingResponse.data[0].embedding;

            vectors.push({
                id: promo.promocionId.toString(),
                values: vectorValues,
                metadata: {
                    titulo: promo.titulo,
                    descuentoPct: promo.descuentoPct,
                    fechaFin: promo.fechaFin
                }
            });
        }

        if (vectors.length > 0) {
            await this.index.upsert({
                upsertRequest: {
                    vectors,
                    namespace: 'promociones'
                }
            });
        }
    }

    /**
     * Búsqueda semántica en promociones a partir de un texto(s).  
     * @param {string} queryText
     * @param {number} topK
     * @returns [ { promocion: { promocionId, titulo, descuentoPct, fechaFin }, score }, … ]
     */
    async semanticSearch(queryText, topK = 3) {
        const embeddingResponse = await this.openaiClient.embedText(queryText);
        const queryVector = embeddingResponse.data[0].embedding;

        const queryResponse = await this.index.query({
            queryRequest: {
                topK,
                vector: queryVector,
                includeMetadata: true,
                namespace: 'promociones'
            }
        });

        const results = [];
        for (const match of queryResponse.matches) {
            results.push({
                promocion: {
                    promocionId: parseInt(match.id, 10),
                    titulo: match.metadata.titulo,
                    descuentoPct: match.metadata.descuentoPct,
                    fechaFin: match.metadata.fechaFin
                },
                score: match.score
            });
        }
        return results;
    }
}

module.exports = PineconePromocionRepository;
