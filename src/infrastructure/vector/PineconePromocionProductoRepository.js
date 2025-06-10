// src/infrastructure/vector/PineconePromocionProductoRepository.js
const pLimit = require('p-limit');
const limit = pLimit(2);
const BATCH_SIZE = 50;

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlPromoProdRepository = require('../db/MysqlPromocionProductoRepository');

class PineconePromocionProductoRepository {
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'promocion-productos';
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
        console.log(`🚀 [${this.namespace}] Iniciando syncAll…`);
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        const items = await new MysqlPromoProdRepository().findAllActive();
        console.log(`   → ${items.length} promos-productos a procesar.`);

        const vectors = [];
        for (const pp of items) {
            const vec = await limit(async () => {
                console.log(`     • Embedding ppId=${pp.promocionProductoId}`);
                const { data } = await this.embedClient.embedText(
                    `Promo: ${pp.promocionTitulo} — Producto: ${pp.productoNombre}`
                );
                return {
                    id: pp.promocionProductoId.toString(),
                    values: data[0].embedding,
                    metadata: {
                        promocionTitulo: pp.promocionTitulo,
                        productoNombre: pp.productoNombre,
                        productoGenero: pp.productoGenero,
                        categoriaNombre: pp.categoriaNombre,
                        marcaNombre: pp.marcaNombre
                    }
                };
            }).catch(err => {
                console.warn(`⚠️ [${this.namespace}] Falló embedding ppId=${pp.promocionProductoId}: ${err.message}`);
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

module.exports = PineconePromocionProductoRepository;
