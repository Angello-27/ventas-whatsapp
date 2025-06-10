// src/infrastructure/vector/PineconePromocionProductoRepository.js

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlPromocionProductoRepository = require('../db/MysqlPromocionProductoRepository');

class PineconePromocionProductoRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.alreadySynced = false;
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
    }

    async needsSync() {
        // Si ya sincronizamos en este ciclo de vida, nunca más tocar Pinecone:
        if (this.alreadySynced) return false;

        // 1) Obtenemos la instancia real de Pinecone
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        try {
            // 2) Llamamos a describeIndexStats especificando la namespace "productos"
            const statsResponse = await index.describeIndexStats({
                describeIndexStatsRequest: {
                    namespace: 'promocionproductos'
                }
            });

            // statsResponse.namespaces["productos"].vectorCount es el número de vectores
            const namespaceInfo = statsResponse.namespaces?.promocionproductos;
            const count = namespaceInfo ? namespaceInfo.vectorCount : 0;

            // Si no hay vectores (0), devolvemos true para sincronizar
            return (count === 0);
        } catch (err) {
            // Si la namespace o el índice no existen, Pinecone arrojará PineconeNotFoundError
            if (err.name === 'PineconeNotFoundError') {
                return true;
            }
            throw err;
        }
    }

    /**
     * Resto de métodos (syncAllToVectorDB, semanticSearch) tal como los tienes.
     */
    async syncAllToVectorDB() {
        // 1) Obtenemos la instancia real de PineconeClient
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        // 1) Obtener todos los objetivos de promoción activos
        const repo = new MysqlPromocionProductoRepository();
        const items = await repo.findAllActive();
        // espera [{ promocionProductoId, promocionId, promocionTitulo, productoId, productoNombre, ... }, ...]

        // 2) Construir vectores con embeddings
        const vectors = [];
        for (const item of items) {
            const text = `Promo: ${item.promocionTitulo} → Producto: ${item.productoNombre}`;
            const embedResp = await this.embedClient.embedText(text);
            const values = embedResp.data[0].embedding;

            vectors.push({
                id: item.promocionProductoId.toString(),
                values,
                metadata: {
                    promocionId: item.promocionId,
                    promocionTitulo: item.promocionTitulo,
                    productoId: item.productoId,
                    productoNombre: item.productoNombre
                }
            });
        }

        // 3) Upsert en Pinecone
        if (vectors.length) {
            await index.upsert(
                vectors,
                { namespace: 'promocionproductos' }
            );
            console.log(`🟢 Subidos ${vectors.length} vectores a namespace "promocionproductos"`);
        } else {
            console.log('⚠️ No hay objetivos de promoción para sincronizar.');
        }

        this.alreadySynced = true;
    }

    /**
     * Búsqueda semántica sobre objetivos de promoción:
     * devuelve items { promocionProductoId, promocionId, promocionTitulo, productoId, productoNombre, score }
     */
    async semanticSearch(queryText, topK = 5) {
        // 1) Embed de la consulta
        const embedResp = await this.embedClient.embedText(queryText);
        const queryVector = embedResp.data[0].embedding;

        // 2) Query Pinecone
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);
        const resp = await index.query(
            {
                namespace: 'promocionproductos',
                topK,
                vector: queryVector,
                includeMetadata: true
            }
        );

        // 3) Mapear resultados
        return resp.matches.map(m => ({
            promocionProductoId: parseInt(m.id, 10),
            promocionId: m.metadata.promocionId,
            promocionTitulo: m.metadata.promocionTitulo,
            productoId: m.metadata.productoId,
            productoNombre: m.metadata.productoNombre,
            score: m.score
        }));
    }
}

module.exports = PineconePromocionProductoRepository;
