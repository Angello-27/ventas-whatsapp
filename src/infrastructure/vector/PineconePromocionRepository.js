// src/infrastructure/vector/PineconePromocionRepository.js
const pLimit = require('p-limit');
const limit = pLimit(2);
const BATCH_SIZE = 50;

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlPromocionRepository = require('../db/MysqlPromocionRepository');

class PineconePromocionRepository {
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'promociones';
    }

    async needsSync() {
        console.log(`🔍 [${this.namespace}] Comprobando sync…`);
        if (this.alreadySynced) return false;
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);
        try {
            const stats = await index.describeIndexStats({
                describeIndexStatsRequest: { namespace: this.namespace }
            });
            const count = stats.namespaces?.[this.namespace]?.vectorCount ?? 0;
            console.log(`   → vectorCount = ${count}`);
            return count === 0;
        } catch (err) {
            if (err.name === 'PineconeNotFoundError') return true;
            throw err;
        }
    }

    async syncAllToVectorDB() {
        console.log(`🚀 [${this.namespace}] Iniciando syncAllToVectorDB…`);
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        const items = await new MysqlPromocionRepository().findAllActive();
        console.log(`   → ${items.length} promociones a procesar.`);

        const vectors = [];
        for (const promo of items) {
            const vec = await limit(async () => {
                console.log(`     • Embedding promocionId=${promo.promocionId}`);
                const { data } = await this.embedClient.embedText(
                    `${promo.titulo} – ${promo.descuento}% ${promo.tipoPromo}: ${promo.targetNombre}`
                );
                return {
                    id: promo.promocionId.toString(),
                    values: data[0].embedding,
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
            }).catch(err => {
                console.warn(`⚠️ [${this.namespace}] Falló embedding promoId=${promo.promocionId}: ${err.message}`);
                return null;
            });
            if (vec) vectors.push(vec);
        }
        console.log(`   → ${vectors.length} embeddings generados.`);

        const totalBatches = Math.ceil(vectors.length / BATCH_SIZE);
        console.log(`   → Subiendo ${totalBatches} lotes…`);
        for (let i = 0; i < totalBatches; i++) {
            const batch = vectors.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            console.log(`     · Lote ${i + 1}/${totalBatches} (${batch.length} vectores)`);
            try {
                await index.upsert(batch, { namespace: this.namespace });
            } catch (err) {
                console.error(`❌ [${this.namespace}] Error lote ${i + 1}: ${err.message}`);
            }
        }

        this.alreadySynced = true;
        console.log(`✅ [${this.namespace}] syncAllToVectorDB completado.`);
    }
}

module.exports = PineconePromocionRepository;
