// src/infrastructure/vector/PineconeVarianteRepository.js
const pineconeConfig = require('../../config/pineconeConfig');
const MysqlVarianteRepository = require('../db/MysqlProductoVarianteRepository');

class PineconeVarianteRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'variantes';
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

        const mysqlRepo = new MysqlVarianteRepository();
        const items = await mysqlRepo.findAllActive();

        const vectors = await Promise.all(items.map(async v => {
            const textResp = await this.embedClient.embedText(
                `${v.productoNombre} - ${v.color} ${v.talla}` +
                (v.material ? ` (${v.material})` : '')
            );
            const values = textResp.data[0].embedding;
            return {
                id: v.varianteId.toString(),
                values,
                metadata: {
                    sku: v.sku,
                    productoNombre: v.productoNombre,
                    color: v.color,
                    talla: v.talla,
                    material: v.material,
                    precioVenta: v.precioVenta,
                    cantidad: v.cantidad
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
            variante: {
                varianteId: parseInt(m.id, 10),
                sku: m.metadata.sku,
                productoNombre: m.metadata.productoNombre,
                color: m.metadata.color,
                talla: m.metadata.talla,
                material: m.metadata.material,
                precioVenta: m.metadata.precioVenta,
                cantidad: m.metadata.cantidad
            },
            score: m.score
        }));
    }
}

module.exports = PineconeVarianteRepository;