// src/infrastructure/vector/PineconeProductoRepository.js
const pineconeConfig = require('../../config/pineconeConfig');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

class PineconeProductoRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'productos';
    }
    async needsSync() {
        if (this.alreadySynced) return false;
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);
        try {
            const stats = await index.describeIndexStats({ describeIndexStatsRequest: { namespace: this.namespace } });
            const count = stats.namespaces?.[this.namespace]?.vectorCount || 0;
            return count === 0;
        } catch (err) {
            if (err.name === 'PineconeNotFoundError') return true;
            throw err;
        }
    }

    async syncAllToVectorDB() {
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        const mysqlRepo = new MysqlProductoRepository();
        const items = await mysqlRepo.findAllActive();

        const vectors = await Promise.all(items.map(async prod => {
            const textResp = await this.embedClient.embedText(`${prod.nombre} (${prod.genero}) Marca: ${prod.marcaNombre}, Cat: ${prod.categoriaNombre}`);
            const values = textResp.data[0].embedding;
            return {
                id: prod.productoId.toString(),
                values,
                metadata: {
                    nombre: prod.nombre,
                    marcaNombre: prod.marcaNombre,
                    categoriaNombre: prod.categoriaNombre,
                    genero: prod.genero
                }
            };
        }));

        if (vectors.length) {
            await index.upsert(vectors, { namespace: this.namespace });
            this.alreadySynced = true;
        }
    }

    async semanticSearch(queryText, topK = 3) {
        const qResp = await this.embedClient.embedText(queryText);
        const queryVector = qResp.data[0].embedding;
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        const result = await index.query(
            { topK, vector: queryVector, includeMetadata: true },
            { namespace: this.namespace }
        );

        return result.matches.map(m => ({
            producto: {
                productoId: parseInt(m.id, 10),
                nombre: m.metadata.nombre,
                marcaNombre: m.metadata.marcaNombre,
                categoriaNombre: m.metadata.categoriaNombre,
                genero: m.metadata.genero
            },
            score: m.score
        }));
    }
}

module.exports = PineconeProductoRepository;