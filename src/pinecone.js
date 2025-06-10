// src/scripts/syncPinecone.js

// 0) Cargamos variables de entorno de .env
require('dotenv').config();

// 1) Traemos el builder con todos los repos (MySQL + Pinecone)
const { buildDeps } = require('../src/infrastructure/web/dependencyInjector');
// 2) Traemos el manager que recorre y sincroniza cada repo Pinecone
const { syncAllIfNeeded } = require('../src/infrastructure/vector/pineconeSyncManager');

async function main() {
    // Instanciar repositorios (MySQL + Pinecone + OpenAI)
    const { pineconeRepos } = buildDeps();

    // Llamamos al sync
    try {
        await syncAllIfNeeded(pineconeRepos);
        console.log('✅ Sincronización inicial de Pinecone completada.');
    } catch (err) {
        console.error('❌ Error en syncAllIfNeeded:', err);
        process.exit(1);
    }
}

main();
