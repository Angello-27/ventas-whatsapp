// src/infrastructure/vector/PineconeProductoRepository.js

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

class PineconeProductoRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
    }

    async needsSync() {
        // 1) Esperamos a que se resuelva la promesa del cliente Pinecone
        const client = await this.pineconePromise;

        // 2) Creamos el objeto Index (v6.x usa client.Index(indexName))
        const index = client.Index(pineconeConfig.indexName);

        try {
            // 3) Llamamos a describeIndexStats o describeIndex para ver si existe y cuántos vectores tiene
            const stats = await index.describeIndexStats({ describeIndexStatsRequest: {} });
            return stats.totalVectorCount === 0;
        } catch (err) {
            // Si el índice no existe, Pinecone lanza PineconeNotFoundError
            if (err.name === 'PineconeNotFoundError') {
                return true;
            }
            throw err;
        }
    }

    async syncAllToVectorDB() {
        // 1) Obtenemos la instancia real de PineconeClient
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        // 2) Obtenemos todos los productos desde MySQL
        const mysqlRepo = new MysqlProductoRepository();
        const productos = await mysqlRepo.findAllActive();

        // 3) Generamos embeddings y armamos el array “vectors”
        const vectors = [];
        for (const prod of productos) {
            const textToEmbed = `${prod.nombre} (${prod.genero}) - Marca: ${prod.marcaNombre}, Categoría: ${prod.categoriaNombre}`;
            const embeddingResponse = await this.embedClient.embedText(textToEmbed);
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

        // 4) Hacemos el upsert (v6.x):
        if (vectors.length > 0) {
            await index.upsert({
                vectors,
                namespace: 'productos'
            });
            console.log(`🟢 Se subieron ${vectors.length} vectores al índice "${pineconeConfig.indexName}".`);
        } else {
            console.log('⚠️ No hay vectores para subir (la lista está vacía).');
        }
    }

    async semanticSearch(queryText, topK = 3) {
        // 1) Generar embedding de la consulta
        const embeddingResponse = await this.embedClient.embedText(queryText);
        const queryVector = embeddingResponse.data[0].embedding;

        // 2) Obtener cliente e índice
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        // 3) Ejecutar query
        const queryResponse = await index.query({
            topK,
            vector: queryVector,
            includeMetadata: true,
            namespace: 'productos'
        });

        // 4) Mapear los resultados
        return queryResponse.matches.map(match => ({
            producto: {
                productoId: parseInt(match.id, 10),
                nombre: match.metadata.nombre,
                marcaNombre: match.metadata.marcaNombre,
                logoUrl: match.metadata.logoUrl,
                categoriaNombre: match.metadata.categoriaNombre,
                genero: match.metadata.genero
            },
            score: match.score
        }));
    }
}

module.exports = PineconeProductoRepository;
