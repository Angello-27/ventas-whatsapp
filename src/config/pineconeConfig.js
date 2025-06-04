/**
 * apiKey:         Tu clave secreta de Pinecone, definida en PINECONE_API_KEY.
 * environment:    El entorno en el que está desplegado Pinecone (por ejemplo "us-west1-gcp"),
 *                 definido en PINECONE_ENVIRONMENT.
 * indexName:      Nombre del índice de vectores a usar. Si no se define, se usará
 *                 "productos-index" por defecto.
 */
module.exports = {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    indexName: process.env.PINECONE_INDEX_NAME || 'productos-index'
};
