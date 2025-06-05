// src/infrastructure/vector/PineconeProductoRepository.js

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

class PineconeProductoRepository {
    /**
     * @param {import('@pinecone-database/pinecone').PineconeClient} pineconeInstance 
     * @param {{ embedText: (text: string) => Promise<any> }} openaiClient 
     */
    constructor(pineconeInstance, openaiClient) {
        this.pinecone = pineconeInstance;
        this.openaiClient = openaiClient;
        // Asignamos el índice (asumimos que ya existe)
        this.index = this.pinecone.Index(pineconeConfig.indexName);
    }

    /**
     * Toma todos los productos activos de MySQL, genera embeddings via OpenAI y hace upsert en Pinecone (namespace="productos").
     */
    async syncAllToVectorDB() {
        const mysqlRepo = new MysqlProductoRepository();
        const productos = await mysqlRepo.findAllActive();
        // productos: [ { productoId, nombre, descripcion, categoriaId, marcaId, … }, … ]

        const vectors = [];
        for (const prod of productos) {
            const textToEmbed = `${prod.nombre}: ${prod.descripcion || ''}`;
            const embeddingResponse = await this.openaiClient.embedText(textToEmbed);
            const vectorValues = embeddingResponse.data[0].embedding;

            vectors.push({
                id: prod.productoId.toString(),
                values: vectorValues,
                metadata: {
                    nombre: prod.nombre,
                    categoriaId: prod.categoriaId,
                    marcaId: prod.marcaId
                }
            });
        }

        if (vectors.length > 0) {
            await this.index.upsert({
                upsertRequest: {
                    vectors,
                    namespace: 'productos'
                }
            });
        }
    }

    /**
     * Búsqueda semántica en Pinecone a partir de un texto, devuelve
     * topK productos junto con su score.
     *
     * @param {string} queryText
     * @param {number} [topK=3]
     * @returns {Promise<Array<{ producto: { productoId:number, nombre:string, categoriaId:number, marcaId:number }, score:number }>>}
     */
    async semanticSearch(queryText, topK = 3) {
        const embeddingResponse = await this.openaiClient.embedText(queryText);
        const queryVector = embeddingResponse.data[0].embedding;

        const queryResponse = await this.index.query({
            queryRequest: {
                topK,
                vector: queryVector,
                includeMetadata: true,
                namespace: 'productos'
            }
        });

        const results = [];
        for (const match of queryResponse.matches) {
            results.push({
                producto: {
                    productoId: parseInt(match.id, 10),
                    nombre: match.metadata.nombre,
                    categoriaId: match.metadata.categoriaId,
                    marcaId: match.metadata.marcaId
                },
                score: match.score
            });
        }
        return results;
    }
}

module.exports = PineconeProductoRepository;
