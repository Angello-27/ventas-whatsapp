// src/infrastructure/vector/PineconeProductoRepository.js
const pLimit = require('p-limit').default; // cargar default para ESM-only p-limit
const limit = pLimit(2);           // máximo 2 embeddings concurrentes
const BATCH_SIZE = 50;              // tamaño de lote para upsert

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

class PineconeProductoRepository {
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
        this.namespace = 'productos';
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
        const items = await new MysqlProductoRepository().findAllActive();
        console.log(`   → [${this.namespace}] ${items.length} items a procesar.`);

        // 2) Generar embeddings con concurrencia limitada
        const vectors = [];
        for (const prod of items) {
            const vec = await limit(async () => {
                console.log(`     • Generando embedding para productoId=${prod.productoId}`);
                const { data } = await this.embedClient.embedText(
                    `${prod.nombre} (${prod.genero}) – Marca: ${prod.marcaNombre}, Cat: ${prod.categoriaNombre}`
                );
                return {
                    id: prod.productoId.toString(),
                    values: data[0].embedding,
                    metadata: {
                        nombre: prod.nombre,
                        marcaNombre: prod.marcaNombre,
                        categoriaNombre: prod.categoriaNombre,
                        genero: prod.genero
                    }
                };
            }).catch(err => {
                console.warn(`⚠️ [${this.namespace}] Falló embedding prodId=${prod.productoId}: ${err.message}`);
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

        try {
            const { data } = await this.embedClient.embedText(queryText);
            const client = await this.pineconePromise;
            const index = client.index(pineconeConfig.indexName);

            // ✅ SINTAXIS CORRECTA para Pinecone v6.1: usar .namespace() primero
            const namespacedIndex = index.namespace(this.namespace);
            const result = await namespacedIndex.query({
                topK: topK,
                vector: data[0].embedding,
                includeMetadata: true
            });

            console.log(`🔍 [${this.namespace}] Resultados encontrados: ${result.matches?.length || 0}`);

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
        } catch (error) {
            console.error(`❌ [${this.namespace}] Error en semanticSearch:`, error);
            throw error;
        }
    }
}

module.exports = PineconeProductoRepository;