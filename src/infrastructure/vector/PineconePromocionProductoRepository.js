// src/infrastructure/vector/PineconePromocionProductoRepository.js
const pineconeConfig = require('../../config/pineconeConfig');
const MysqlPromoProdRepository = require('../db/MysqlPromocionProductoRepository');

class PineconePromocionProductoRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'promocion-productos';
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

        const mysqlRepo = new MysqlPromoProdRepository();
        const items = await mysqlRepo.findAllActive();

        const vectors = await Promise.all(items.map(async pp => {
            const textResp = await this.embedClient.embedText(
                `Promo: ${pp.promocionTitulo} — Producto: ${pp.productoNombre}`
            );
            const values = textResp.data[0].embedding;
            return {
                id: pp.promocionProductoId.toString(),
                values,
                metadata: {
                    promocionTitulo: pp.promocionTitulo,
                    productoNombre: pp.productoNombre,
                    productoGenero: pp.productoGenero,
                    categoriaNombre: pp.categoriaNombre,
                    marcaNombre: pp.marcaNombre
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
            promocionProducto: {
                promocionProductoId: parseInt(m.id, 10),
                promocionTitulo: m.metadata.promocionTitulo,
                productoNombre: m.metadata.productoNombre,
                productoGenero: m.metadata.productoGenero,
                categoriaNombre: m.metadata.categoriaNombre,
                marcaNombre: m.metadata.marcaNombre
            },
            score: m.score
        }));
    }
}

module.exports = PineconePromocionProductoRepository;