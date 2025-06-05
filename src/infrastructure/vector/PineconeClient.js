// infrastructure/vector/PineconeClient.js

const { PineconeClient } = require('@pinecone-database/pinecone');
const pineconeConfig = require('../../config/pineconeConfig');

const pinecone = new PineconeClient();

async function initPinecone() {
    await pinecone.init({
        apiKey: pineconeConfig.apiKey,
        environment: pineconeConfig.environment
    });

    // Si el índice no existe, créalo. De lo contrario, ignora.
    const existingIndexes = await pinecone.listIndexes();
    if (!existingIndexes.includes(pineconeConfig.indexName)) {
        await pinecone.createIndex({
            createRequest: {
                name: pineconeConfig.indexName,
                dimension: 1536,   // corresponde a embeddings de OpenAI (p. ej. text-embedding-ada-002)
                metric: 'cosine'
            }
        });
    }
}

initPinecone()
    .then(() => console.log(`Pinecone inicializado y listo (índice: ${pineconeConfig.indexName})`))
    .catch(err => console.error('Error inicializando Pinecone:', err));

module.exports = pinecone;
