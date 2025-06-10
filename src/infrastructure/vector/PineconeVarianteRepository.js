// src/infrastructure/vector/PineconeVarianteRepository.js
const pLimit = require('p-limit');
const limit = pLimit(2);           // máximo 2 embeddings concurrentes
const BATCH_SIZE = 50;              // tamaño de lote para upsert

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlVarianteRepository = require('../db/MysqlProductoVarianteRepository');

class PineconeVarianteRepository {
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'variantes';
    }

    async needsSync() {
        console.log(`🔍 [${this.namespace}] Comprobando si '${this.namespace}' necesita sync…`);
        if (this.alreadySynced) {
            console.log(`   → [${this.namespace}] Ya sincronizado en esta sesión.`);
            return false;
        }
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);
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
        const index = client.Index(pineconeConfig.indexName);

        // 1) Obtener datos de MySQL
        const items = await new MysqlVarianteRepository().findAllActive();
        console.log(`   → [${this.namespace}] ${items.length} items a procesar.`);

        // 2) Generar embeddings con concurrencia limitada
        const vectors = [];
        for (const v of items) {
            const vec = await limit(async () => {
                console.log(`     • Embedding varianteId=${v.varianteId}`);
                const { data } = await this.embedClient.embedText(
                    `${v.productoNombre} – ${v.color} ${v.talla}` +
                    (v.material ? ` (${v.material})` : '')
                );
                return {
                    id: v.varianteId.toString(),
                    values: data[0].embedding,
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
            }).catch(err => {
                console.warn(`⚠️ [${this.namespace}] Falló embedding varId=${v.varianteId}: ${err.message}`);
                return null;
            });
            if (vec) vectors.push(vec);
        }
        console.log(`   → [${this.namespace}] ${vectors.length} embeddings generados.`);

        // 3) Subir en lotes
        const totalBatches = Math.ceil(vectors.length / BATCH_SIZE);
        console.log(`   → [${this.namespace}] Subiendo ${totalBatches} lotes…`);
        for (let i = 0; i < totalBatches; i++) {
            const batch = vectors.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            console.log(`     · [${this.namespace}] Lote ${i + 1}/${totalBatches} (${batch.length} vectores)`);
            try {
                await index.upsert(batch, { namespace: this.namespace });
            } catch (err) {
                console.error(`❌ [${this.namespace}] Error lote ${i + 1}: ${err.message}`);
            }
        }

        this.alreadySynced = true;
        console.log(`✅ [${this.namespace}] syncAllToVectorDB completado.`);
    }

    async semanticSearch(queryText, topK = 3) {
        console.log(`❓ [${this.namespace}] semanticSearch query="${queryText}" topK=${topK}`);
        const { data } = await this.embedClient.embedText(queryText);
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        const result = await index.query(
            { topK, vector: data[0].embedding, includeMetadata: true },
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