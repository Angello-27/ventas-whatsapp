// src/infrastructure/vector/PineconePromocionRepository.js
const pLimit = require('p-limit').default; // cargar default para ESM-only p-limit
const limit = pLimit(2);           // máximo 2 embeddings concurrentes
const BATCH_SIZE = 50;              // tamaño de lote para upsert

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
        const items = await new MysqlPromocionRepository().findAllActive();
        console.log(`   → [${this.namespace}] ${items.length} promociones a procesar.`);

        // 2) Generar embeddings con concurrencia limitada
        const vectors = [];
        for (const promo of items) {
            const vec = await limit(async () => {
                console.log(`     • Generando embedding para promocionId=${promo.promocionId}`);
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
        console.log(`   → [${this.namespace}] ${vectors.length} embeddings generados.`);

        // 3) Subir en lotes
        const totalBatches = Math.ceil(vectors.length / BATCH_SIZE);
        console.log(`   → [${this.namespace}] Subiendo ${totalBatches} lotes de hasta ${BATCH_SIZE} vectores…`);
        for (let i = 0; i < totalBatches; i++) {
            const batch = vectors.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            console.log(`     · [${this.namespace}] Lote ${i + 1}/${totalBatches} (${batch.length} vectores)`);
            try {
                await index.upsert({
                    vectors: batch,
                    namespace: this.namespace
                });
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
        const index = client.Index(pineconeConfig.indexName);

        const result = await index.query(
            { topK, vector: data[0].embedding, includeMetadata: true },
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