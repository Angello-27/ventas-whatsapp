#!/usr/bin/env node
// src/scripts/syncPinecone.js

// 1) Traemos el builder con todos los repos (MySQL + Pinecone)
const { buildDeps } = require('../infrastructure/web/dependencyInjector');
// 2) Traemos el manager que recorre y sincroniza cada repo Pinecone
const { syncAllIfNeeded } = require('../src/infrastructure/vector/pineconeSyncManager');

async function main() {
    // Instanciamos todas las deps
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
