// src/infrastructure/vector/PineconeProductoRepository.js

const pineconeConfig = require('../../config/pineconeConfig');
const MysqlProductoRepository = require('../db/MysqlProductoRepository');

class PineconeProductoRepository {
    /**
     * @param {Promise<import('@pinecone-database/pinecone').Pinecone>} pineconePromise
     * @param {{ embedText: (text: string) => Promise<any> }} embedClient
     */
    constructor(pineconePromise, embedClient) {
        this.pineconePromise = pineconePromise;
        this.embedClient = embedClient;
    }

    /**
   * Devuelve true si la namespace "productos" NO tiene vectores (totalVectorCount === 0).
   * Si la namespace no existe, también devuelve true para que luego se cree y se sincronicen.
   */
    async needsSync() {
        // 1) Obtenemos la instancia real de Pinecone
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        try {
            // 2) Llamamos a describeIndexStats especificando la namespace "productos"
            const statsResponse = await index.describeIndexStats({
                describeIndexStatsRequest: {
                    namespace: 'productos'
                }
            });

            // statsResponse.namespaces["productos"].vectorCount es el número de vectores
            const namespaceInfo = statsResponse.namespaces?.productos;
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

        // 2) Obtenemos todos los productos desde MySQL
        const mysqlRepo = new MysqlProductoRepository();
        const productos = await mysqlRepo.findAllActive();

        // 3) Generamos embeddings y armamos el array “vectors”
        const vectors = [];
        for (const prod of productos) {
            const textToEmbed = `${prod.nombre} (${prod.genero}) - Marca: ${prod.marcaNombre}, Categoría: ${prod.categoriaNombre}`;
            const embeddingResponse = await this.embedClient.embedText(textToEmbed);
            const vectorValues = embeddingResponse.data[0].embedding;

            vectors.push({
                id: prod.productoId.toString(),
                values: vectorValues,
                metadata: {
                    nombre: prod.nombre,
                    marcaNombre: prod.marcaNombre,
                    logoUrl: prod.logoUrl,
                    categoriaNombre: prod.categoriaNombre,
                    genero: prod.genero
                }
            });
        }

        // 4) Hacemos el upsert (v6.x):
        if (vectors.length > 0) {
            await index.upsert(
                vectors,                  // <- array aquí
                { namespace: 'productos' } // <- segundo parámetro con namespace
            );
            console.log(`🟢 Se subieron ${vectors.length} vectores al índice "${pineconeConfig.indexName}".`);
        } else {
            console.log('⚠️ No hay vectores para subir (la lista está vacía).');
        }
    }

    async semanticSearch(queryText, topK = 3) {
        // 1) Generar embedding de la consulta
        const embeddingResponse = await this.embedClient.embedText(queryText);
        const queryVector = embeddingResponse.data[0].embedding;

        // 2) Obtener cliente e índice
        const client = await this.pineconePromise;
        const index = client.Index(pineconeConfig.indexName);

        // 3) Ejecutar query
        const queryResponse = await index.query({
            topK,
            vector: queryVector,
            includeMetadata: true,
            namespace: 'productos'
        });

        // 4) Mapear los resultados
        return queryResponse.matches.map(match => ({
            producto: {
                productoId: parseInt(match.id, 10),
                nombre: match.metadata.nombre,
                marcaNombre: match.metadata.marcaNombre,
                logoUrl: match.metadata.logoUrl,
                categoriaNombre: match.metadata.categoriaNombre,
                genero: match.metadata.genero
            },
            score: match.score
        }));
    }
}

module.exports = PineconeProductoRepository;
