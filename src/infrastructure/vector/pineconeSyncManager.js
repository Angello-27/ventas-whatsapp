// src/infrastructure/vector/pineconeSyncManager.js

/**
 * pineconeSyncManager
 * 
 * Recibe un objeto con tus repositorios Pinecone (por ejemplo: pineProductoRepo, pineVarianteRepo, etc.)
 * y, para cada uno, hace:
 *   1) needsSync() → describeIndexStats para ver si hay vectores
 *   2) si needsSync() es true → syncAllToVectorDB()
 */

async function syncAllIfNeeded(pineRepos) {
    // pineRepos es un objeto { pineProductoRepo, pineVarianteRepo, ... }
    for (const [key, repo] of Object.entries(pineRepos)) {
        // Solo procesamos aquellos repositorios que tengan methods needsSync y syncAllToVectorDB
        if (
            repo &&
            typeof repo.needsSync === 'function' &&
            typeof repo.syncAllToVectorDB === 'function'
        ) {
            try {
                const needs = await repo.needsSync();
                if (needs) {
                    console.log(`🟡 [${key}] Índice Pinecone "${key}" vacío → sincronizando…`);
                    await repo.syncAllToVectorDB();
                    console.log(`🟢 [${key}] Índice Pinecone "${key}" poblado exitosamente.`);
                } else {
                    console.log(`✅ [${key}] Índice Pinecone "${key}" ya tiene vectores; se omite sync.`);
                }
            } catch (err) {
                console.error(`❌ Error al verificar/sincronizar Pinecone para "${key}":`, err);
            }
        }
    }
}

module.exports = { syncAllIfNeeded };
