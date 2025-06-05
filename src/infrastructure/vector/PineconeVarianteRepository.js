// src/infrastructure/vector/PineconeVarianteRepository.js

const { PineconeClient } = require('@pinecone-database/pinecone');
const pineconeConfig = require('../../config/pineconeConfig');
const OpenAIClient = require('../../openai/OpenAIClient');
const MysqlVarianteRepository = require('../db/MysqlVarianteRepository');

class PineconeVarianteRepository {
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
     * Reindexa todas las variantes activas en MySQL: genera un embedding a partir
     * de SKU + color + talla + material, y hace upsert en namespace="variantes".
     */
    async syncAllToVectorDB() {
        const mysqlRepo = new MysqlVarianteRepository();
        const variantes = await mysqlRepo.findAllActive();
        // findAllActive() debería devolver:
        // [ { varianteId, sku, color, talla, material, productoId, … }, … ]

        const vectors = [];
        for (const varian of variantes) {
            const textToEmbed = `${varian.sku}: ${varian.color} ${varian.talla} ${varian.material}`;
            const embeddingResponse = await this.openaiClient.embedText(textToEmbed);
            const vectorValues = embeddingResponse.data[0].embedding;

            vectors.push({
                id: varian.varianteId.toString(),
                values: vectorValues,
                metadata: {
                    sku: varian.sku,
                    color: varian.color,
                    talla: varian.talla,
                    productoId: varian.productoId
                }
            });
        }

        if (vectors.length > 0) {
            await this.index.upsert({
                upsertRequest: {
                    vectors,
                    namespace: 'variantes'
                }
            });
        }
    }

    /**
     * Búsqueda semántica en variantes a partir de un texto descriptivo.
     * @param {string} queryText
     * @param {number} topK
     * @returns [ { variante: { varianteId, sku, color, talla, productoId }, score }, … ]
     */
    async semanticSearch(queryText, topK = 3) {
        const embeddingResponse = await this.openaiClient.embedText(queryText);
        const queryVector = embeddingResponse.data[0].embedding;

        const queryResponse = await this.index.query({
            queryRequest: {
                topK,
                vector: queryVector,
                includeMetadata: true,
                namespace: 'variantes'
            }
        });

        const results = [];
        for (const match of queryResponse.matches) {
            results.push({
                variante: {
                    varianteId: parseInt(match.id, 10),
                    sku: match.metadata.sku,
                    color: match.metadata.color,
                    talla: match.metadata.talla,
                    productoId: match.metadata.productoId
                },
                score: match.score
            });
        }
        return results;
    }
}

module.exports = PineconeVarianteRepository;
