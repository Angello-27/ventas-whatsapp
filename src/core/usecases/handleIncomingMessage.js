/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp
 */
async function handleIncomingMessage(
  { from, body },
  { clienteRepo, sesionChatRepo, mensajeRepo },
  openaiClient
) {
  // 1) Cliente: busca por teléfono o crea uno nuevo
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

  // 2) Sesión: busca sesión activa o crea una nueva
  let sesion = await sesionChatRepo.findActiveByClienteId(cliente.id);
  if (!sesion) {
    // aquí debe ser clienteId, no customerId
    sesion = await sesionChatRepo.create({ clienteId: cliente.id });
    // también resetea historial al iniciar nueva sesión:
    openaiClient.resetHistory();
  }

  // 3) Mensaje: guarda como 'Entrante'
  await mensajeRepo.save({
    // aquí sesionId en lugar de sessionId
    sesionId: sesion.id,
    direccion: 'Entrante',
    contenido: body   // en lugar de content
  });

  // 4) Genera respuesta con IA
  const systemPrompt = 'Eres un asistente de ventas de ropa. Ofrece sugerencias y promociones según el mensaje del cliente.';
  const reply = await openaiClient.chat({
    systemPrompt,
    userMessage: body
  });

  // 5) Guarda el mensaje de salida
  await mensajeRepo.save({
    sesionId: sesion.id,
    direccion: 'Saliente',
    contenido: reply
  });

  // 6) Respuesta automática
  return reply;
}

module.exports = handleIncomingMessage;