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
     * Toma todos los productos activos desde la vista plana (Marca+Categoría incluidos),
     * genera embeddings via OpenAI y hace upsert en Pinecone (namespace="productos").
     */
    async syncAllToVectorDB() {
        // Ahora usamos el repositorio que lee de la vista plana:
        const mysqlRepo = new MysqlProductoRepository();
        const productos = await mysqlRepo.findAllActive();
        // productos: [ { productoId, nombre, genero, marcaId, marcaNombre, logoUrl, categoriaId, categoriaNombre, createdAt }, … ]

        const vectors = [];
        for (const prod of productos) {
            // Generamos un texto que incluya marcaNombre y categoriaNombre:
            const textToEmbed = `${prod.nombre} (${prod.genero}) - Marca: ${prod.marcaNombre}, Categoría: ${prod.categoriaNombre}`;
            const embeddingResponse = await this.openaiClient.embedText(textToEmbed);
            const vectorValues = embeddingResponse.data[0].embedding;

            vectors.push({
                id: prod.productoId.toString(),
                values: vectorValues,
                metadata: {
                    nombre: prod.nombre,
                    marcaNombre: prod.marcaNombre,
                    logoUrl: prod.logoUrl,
                    categoriaNombre: prod.categoriaNombre,
                    genero: prod.genero
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
     * Búsqueda semántica en Pinecone a partir de un texto.  
     * Devuelve topK resultados con { producto: 
     * { productoId, nombre, marcaNombre, categoriaNombre, logoUrl, genero }, score }.
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
                    marcaNombre: match.metadata.marcaNombre,
                    logoUrl: match.metadata.logoUrl,
                    categoriaNombre: match.metadata.categoriaNombre,
                    genero: match.metadata.genero
                },
                score: match.score
            });
        }
        return results;
    }
}

module.exports = PineconeProductoRepository;
