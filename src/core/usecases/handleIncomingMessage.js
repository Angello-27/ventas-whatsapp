// src/core/usecases/handleIncomingMessage.js

/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp
 * - Guarda cliente / sesión / mensaje
 * - Extrae keywords
 * - Carga vistas (promos, ítems, envase, producto, stock/precio)
 * - Construye prompt con historial, promociones y stock
 * - Llama a OpenAI y devuelve respuesta
 */
async function handleIncomingMessage(
  { from, body },
  {
    clienteRepo,
    sesionChatRepo,
    mensajeRepo,
    campanaAmbitoRepo,
    campanaItemsRepo,
    envaseInfoRepo,
    productoHierarchyRepo,
    stockPrecioRepo,
    chatFullRepo
  },
  openaiClient
) {
  // 1) CLIENTE
  let cliente = await clienteRepo.findByTelefono(from);
  if (!cliente) {
    cliente = await clienteRepo.create({
      nombre: null,
      sexo: null,
      telefono: from,
      email: null,
      direccion: null,
      tipoCliente: 'Nuevo'
    });
  }

  // 2) SESIÓN
  let sesion = await sesionChatRepo.findActiveByClienteId(cliente.id);
  if (!sesion) {
    sesion = await sesionChatRepo.create({ clienteId: cliente.id });
    openaiClient.resetHistory();
  } else {
    // Recuperar todos los mensajes de esta sesión (entrantes y salientes)
    const historyRows = await chatFullRepo.findBySesionId(sesion.id);
    historyRows.forEach(msg => {
      openaiClient.chatHistory.push({
        role: msg.direccion === 'Entrante' ? 'user' : 'assistant',
        content: msg.contenido
      });
    });
  }

  // 3) GUARDAR MENSAJE ENTRANTE
  await mensajeRepo.save({
    sesionId: sesion.id,
    direccion: 'Entrante',
    contenido: body
  });

  // 4) EXTRAER PALABRAS CLAVE
  const keywords = body.match(/\w+/g) || [];

  // 5) PROMOCIONES ACTIVAS + DETALLE DE ÍTEMS
  const promos = await campanaAmbitoRepo.findActive();  // [{ campanaId, campanaNombre, tipo, … }]
  const promoDetails = await Promise.all(
    promos.map(async p => {
      const items = await campanaItemsRepo.findByCampanaId(p.campanaId);
      // items: [{ itemId, campanaId, envaseId, sku, envaseDescripcion, cantidad }]
      const detailedItems = await Promise.all(
        items.map(async item => {
          // Si no hay envase, saltamos
          const envase = await envaseInfoRepo.findByEnvaseId(item.envaseId);
          if (!envase) return null;

          // Si no hay producto, devolvemos con valores por defecto
          const hierarchy = envase.productoId
            ? await productoHierarchyRepo.findByProductoId(envase.productoId)
            : null;

          return {
            sku: item.sku,
            cantidad: item.cantidad,
            producto: envase.productoNombre || 'Desconocido',
            marca: hierarchy?.marcaNombre || 'Desconocida',
            categoria: hierarchy?.categoriaNombre || 'Desconocida'
          };
        })
      );
      // Filtramos posibles nulls
      return {
        promo: p,
        items: detailedItems.filter(i => i !== null)
      };
    })
  );

  // 6) STOCK Y PRECIOS RELEVANTES
  const stockInfo = await stockPrecioRepo.findByKeywords(keywords);
  const enrichedStock = await Promise.all(
    stockInfo.map(async s => {
      const envase = await envaseInfoRepo.findByEnvaseId(s.envaseId);
      if (!envase) return null;
      const hierarchy = envase.productoId
        ? await productoHierarchyRepo.findByProductoId(envase.productoId)
        : null;

      return {
        sku: s.sku,
        almacen: s.almacenNombre,
        cantidad: s.cantidad,
        precio: s.monto,
        producto: envase.productoNombre || 'Desconocido',
        marca: hierarchy?.marcaNombre || 'Desconocida'
      };
    })
  );
  // Filtramos nulls
  const stockList = enrichedStock.filter(s => s !== null);

  // 7) CONSTRUIR PROMPT PARA IA
  const systemPrompt = `
Eres un asistente de ventas de ropa.
Usa la información de promociones y stock/precio para recomendar productos específicos,
indicando marca y categoría.
`.trim();

  const promoText = promoDetails.length
    ? promoDetails.map(pd =>
      `• ${pd.promo.campanaNombre} (${pd.promo.tipo}):\n  ` +
      pd.items.map(i =>
        `- ${i.producto} (${i.sku}), marca ${i.marca}, categoría ${i.categoria}, qty ${i.cantidad}`
      ).join('\n  ')
    ).join('\n')
    : 'No hay promociones activas.';

  const stockText = stockList.length
    ? stockList.map(s =>
      `• ${s.producto} (${s.sku}) en ${s.almacen}: ` +
      `${s.cantidad} uds a Bs. ${s.precio} (marca ${s.marca})`
    ).join('\n')
    : 'No se encontró stock relevante.';

  const userPrompt = `
Cliente dijo: "${body}"

Historial + contexto ya enviado automáticamente por openaiClient

Promociones y sus ítems:
${promoText}

Stock y precios:
${stockText}
`.trim();

  // 8) LLAMAR A IA
  const reply = await openaiClient.chat({ systemPrompt, userMessage: userPrompt });

  // 9) GUARDAR MENSAJE SALIENTE
  await mensajeRepo.save({
    sesionId: sesion.id,
    direccion: 'Saliente',
    contenido: reply
  });

  return reply;
}

module.exports = handleIncomingMessage;
