// src/infrastructure/vector/PineconeClient.js

/**
 * Cliente global de Pinecone v6 (módulo ESM).  
 *
 * – Usamos `import(...)` dinámico para cargar la clase `Pinecone` desde 
 *   "@pinecone-database/pinecone".  
 * – Luego instanciamos `new Pinecone({ apiKey, environment })`.  
 * – Finalmente, intentamos crear el índice (sin anidar createRequest).
 */

const pineconeConfig = require('../../config/pineconeConfig');

async function createAndInitClient() {
    // 1) Import dinámico del módulo ESM de Pinecone
    const pineconeModule = await import('@pinecone-database/pinecone');

    // 2) La clase que necesitamos se llama “Pinecone”
    const Pinecone = pineconeModule.Pinecone;
    if (typeof Pinecone !== 'function') {
        throw new Error('No se pudo encontrar la clase `Pinecone` en el paquete @pinecone-database/pinecone.');
    }

    // 3) Instanciamos pasándole apiKey y environment directamente
    //    (podrías omitir el campo `environment` si ya lo defines en PINECONE_ENVIRONMENT)
    const client = new Pinecone({
        apiKey: pineconeConfig.apiKey
    });

    // 5) Crear el índice si no existe, usando el formato v6.x sin “createRequest” anidado
    try {
        await client.createIndex({
            name: pineconeConfig.indexName,
            dimension: 1536,    // embeddings de text-embedding-ada-002
            metric: 'cosine',   // opcional si quieres 'cosine' explícito
            spec: {
                serverless: {
                    cloud: 'aws',     // “gcp” o “aws” o “azure”
                    region: pineconeConfig.environment    // “us-west1” o similar
                }
            }
        });
        console.log(`🟢 Índice "${pineconeConfig.indexName}" creado en Pinecone.`);
    } catch (err) {
        // Pinecone devuelve 409 con code "ALREADY_EXISTS" si el índice ya existe.
        const alreadyExists =
            err.code === 'ALREADY_EXISTS' ||
            err.error?.code === 'ALREADY_EXISTS' ||
            (typeof err.message === 'string' && err.message.includes('ALREADY_EXISTS'));

        if (alreadyExists) {
            console.log(`🟡 El índice "${pineconeConfig.indexName}" ya existía → omitiendo creación.`);
        } else {
            console.error('❌ Error creando índice en Pinecone:', err);
            throw err;
        }
    }

    console.log(`✅ Pinecone inicializado y listo (índice: ${pineconeConfig.indexName}).`);
    return client;
}

// Exportamos una promesa que resuelve en la instancia ya inicializada
const pineconeClientPromise = createAndInitClient();
module.exports = pineconeClientPromise;
