// src/infrastructure/vector/PineconePromocionRepository.js
const pineconeConfig = require('../../config/pineconeConfig');
const MysqlPromocionRepository = require('../db/MysqlPromocionRepository');

class PineconePromocionRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'promociones';
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

        const mysqlRepo = new MysqlPromocionRepository();
        const items = await mysqlRepo.findAllActive();

        const vectors = await Promise.all(items.map(async promo => {
            const textResp = await this.embedClient.embedText(
                `${promo.titulo} - ${promo.descuento}% ` +
                `${promo.tipoPromo}: ${promo.targetNombre}`
            );
            const values = textResp.data[0].embedding;
            return {
                id: promo.promocionId.toString(),
                values,
                metadata: {
                    titulo: promo.titulo,
                    descuento: promo.descuento,
                    fechaInicio: promo.fechaInicio,
                    fechaFin: promo.fechaFin,
                    tipoPromo: promo.tipoPromo,
                    targetId: promo.targetId,
                    targetNombre: promo.targetNombre,
                    cobertura: promo.cobertura,
                    genero: promo.genero
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
            promocion: {
                promocionId: parseInt(m.id, 10),
                titulo: m.metadata.titulo,
                descuento: m.metadata.descuento,
                fechaInicio: m.metadata.fechaInicio,
                fechaFin: m.metadata.fechaFin,
                tipoPromo: m.metadata.tipoPromo,
                targetId: m.metadata.targetId,
                targetNombre: m.metadata.targetNombre,
                cobertura: m.metadata.cobertura,
                genero: m.metadata.genero
            },
            score: m.score
        }));
    }
}

module.exports = PineconePromocionRepository;