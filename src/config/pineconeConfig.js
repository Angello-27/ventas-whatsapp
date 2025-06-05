// src/config/pineconeConfig.js

/**
 * apiKey:         Tu clave secreta de Pinecone, definida en PINECONE_API_KEY.
 * environment:    El entorno de Pinecone, ej. "us-west1-gcp", definido en PINECONE_ENVIRONMENT.
 * indexName:      Nombre del índice de vectores. Si no está en .env, usa "productos-index".
 */
module.exports = {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
    indexName: process.env.PINECONE_INDEX_NAME || 'productos-index'
};
