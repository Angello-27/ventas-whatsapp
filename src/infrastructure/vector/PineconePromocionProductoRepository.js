// src/infrastructure/vector/PineconePromocionProductoRepository.js
const pLimit = require('p-limit').default; // cargar default para ESM-only p-limit
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
        console.log(`🔍 [${this.namespace}] Comprobando si '${this.namespace}' necesita sync…`);
        if (this.alreadySynced) {
            console.log(`   → [${this.namespace}] Ya sincronizado en esta sesión.`);
            return false;
        }
        const client = await this.pineconePromise;
        const index = client.index(pineconeConfig.indexName);
        try {
            const stats = await index.describeIndexStats({
                describeIndexStatsRequest: { namespace: this.namespace }
            });
            const count = stats.namespaces?.[this.namespace]?.vectorCount ?? 0;
            console.log(`   → [${this.namespace}] vectorCount = ${count}`);
            return count === 0;
        } catch (err) {
            if (err.name === 'PineconeNotFoundError') {
                console.log(`   → [${this.namespace}] Namespace no existe aún.`);
                return true;
            }
            throw err;
        }
    }

    async syncAllToVectorDB() {
        console.log(`🚀 [${this.namespace}] Iniciando syncAllToVectorDB…`);
        const client = await this.pineconePromise;
        const index = client.index(pineconeConfig.indexName);

        // 1) Obtener datos de MySQL
        const items = await new MysqlPromoProdRepository().findAllActive();
        console.log(`   → [${this.namespace}] ${items.length} items a procesar.`);

        // 2) Generar embeddings con concurrencia limitada
        const vectors = [];
        for (const pp of items) {
            const vec = await limit(async () => {
                console.log(`     • Generando embedding para promocionProductoId=${pp.promocionProductoId}`);
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
                console.warn(`⚠️ [${this.namespace}] Falló embedding promoProdId=${pp.promocionProductoId}: ${err.message}`);
                return null;
            });
            if (vec) vectors.push(vec);
        }
        console.log(`   → [${this.namespace}] ${vectors.length} embeddings generados.`);

        // 3) Subir en lotes
        const totalBatches = Math.ceil(vectors.length / BATCH_SIZE);
        console.log(`   → [${this.namespace}] Subiendo ${totalBatches} lotes de hasta ${BATCH_SIZE} vectores…`);
        for (let i = 0; i < totalBatches; i++) {
            const batch = vectors.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            console.log(`     · [${this.namespace}] Lote ${i + 1}/${totalBatches} (${batch.length} vectores)`);
            try {
                // Intento 1: Usar namespace() method (documentación oficial)
                const namespacedIndex = index.namespace(this.namespace);
                const response = await namespacedIndex.upsert(batch);  // ✅ FIX: Declarar 'const response'
                console.log(`     ✅ Lote ${i + 1} completado`);
            } catch (err) {
                console.error(`❌ [${this.namespace}] Error upsert lote ${i + 1}: ${err.message}`);
            }
        }

        this.alreadySynced = true;
        console.log(`✅ [${this.namespace}] syncAllToVectorDB completado.`);
    }

    async semanticSearch(queryText, topK = 3) {
        console.log(`❓ [${this.namespace}] semanticSearch query="${queryText}" topK=${topK}`);
        const { data } = await this.embedClient.embedText(queryText);
        const client = await this.pineconePromise;
        const index = client.index(pineconeConfig.indexName);

        const result = await index.query(
            { topK, vector: data[0].embedding, includeMetadata: true },
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