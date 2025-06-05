// src/infrastructure/vector/PineconeVarianteRepository.js

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlVarianteRepository = require('../db/MysqlVarianteRepository');

class PineconeVarianteRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
    }

    /**
     * Devuelve true si la namespace "variantes" NO tiene vectores (vectorCount === 0).
     * Si no existe, devuelve true para que se cree y sincronicen.
     */
    async needsSync() {
        if (this.alreadySynced) return false;

        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        try {
            // Describir solo la namespace "variantes"
            const statsResponse = await index.describeIndexStats({
                describeIndexStatsRequest: {
                    namespace: 'variantes'
                }
            });

            // statsResponse.namespaces["variantes"].vectorCount es el número de vectores
            const namespaceInfo = statsResponse.namespaces?.variantes;
            const count = namespaceInfo ? namespaceInfo.vectorCount : 0;
            return (count === 0);
        } catch (err) {
            if (err.name === 'PineconeNotFoundError') {
                return true;
            }
            throw err;
        }
    }

    /**
     * Toma todas las variantes activas (desde MySQL), genera embeddings y hace upsert en Pinecone.
     */
    async syncAllToVectorDB() {
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        // 1) Obtener todas las variantes ya “aplanadas”
        const mysqlRepo = new MysqlVarianteRepository();
        const variantes = await mysqlRepo.findAllActive();

        // 2) Generar vectores: combinamos campos relevantes para embeddar
        const vectors = [];
        for (const v of variantes) {
            // Por ejemplo, concatenamos: productoNombre + color + talla + material + precio
            const textToEmbed =
                `${v.productoNombre} – Variante: Color ${v.color}, Talla ${v.talla}` +
                (v.material ? `, Material ${v.material}` : '') +
                `. Precio: ${v.precioVenta}`;

            const embeddingResponse = await this.embedClient.embedText(textToEmbed);
            const vectorValues = embeddingResponse.data[0].embedding;

            vectors.push({
                id: v.varianteId.toString(),
                values: vectorValues,
                metadata: {
                    sku: v.sku,
                    productoNombre: v.productoNombre,
                    color: v.color,
                    talla: v.talla,
                    material: v.material,
                    precioVenta: v.precioVenta,
                    cantidad: v.cantidad,
                    imagenPrincipalUrl: v.imagenPrincipalUrl
                }
            });
        }

        // 3) Upsert en namespace "variantes"
        if (vectors.length > 0) {
            await index.upsert(
                vectors,
                { namespace: 'variantes' }
            );
            console.log(`🟢 Se subieron ${vectors.length} vectores al índice "${pineconeConfig.indexName}" (namespace "variantes").`);
        } else {
            console.log('⚠️ No hay vectores de variantes para subir (lista vacía).');
        }

        this.alreadySynced = true;
    }

    /**
     * Búsqueda semántica en las variantes. Devuelve up to topK resultados.
     */
    async semanticSearch(queryText, topK = 3) {
        // 1) Generar embedding de la consulta
        const embeddingResponse = await this.embedClient.embedText(queryText);
        const queryVector = embeddingResponse.data[0].embedding;

        // 2) Obtener cliente e índice
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        // 3) Ejecutar query (namespace "variantes")
        const queryResponse = await index.query(
            {
                topK: topK,
                vector: queryVector,
                includeMetadata: true
            },
            {
                namespace: 'variantes'
            }
        );

        // 4) Mapear resultados a un objeto más legible
        return queryResponse.matches.map(match => ({
            variante: {
                varianteId: parseInt(match.id, 10),
                sku: match.metadata.sku,
                productoNombre: match.metadata.productoNombre,
                color: match.metadata.color,
                talla: match.metadata.talla,
                material: match.metadata.material,
                precioVenta: match.metadata.precioVenta,
                cantidad: match.metadata.cantidad,
                imagenPrincipalUrl: match.metadata.imagenPrincipalUrl
            },
            score: match.score
        }));
    }
}

module.exports = PineconeVarianteRepository;
