/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp
 */
async function handleIncomingMessage(
  { from, body },
  { clienteRepo, sesionChatRepo, mensajeRepo }
) {
  // 1) Cliente: busca por teléfono o crea uno nuevo
  let cliente = await clienteRepo.findByTelefono(from);
  if (!cliente) {
    cliente = await clienteRepo.create({
      nombre:     null,
      sexo:       null,
      telefono:   from,
      email:      null,
      direccion:  null,
      tipoCliente:'Nuevo'
    });
  }

  // 2) Sesión: busca sesión activa o crea una nueva
  let sesion = await sesionChatRepo.findActiveByClienteId(cliente.id);
  if (!sesion) {
    // ojo: aquí debe ser clienteId, no customerId
    sesion = await sesionChatRepo.create({ clienteId: cliente.id });
  }

  // 3) Mensaje: guarda como 'Entrante'
  await mensajeRepo.save({
    // ojo: aquí sesionId en lugar de sessionId
    sesionId:  sesion.id,
    direccion: 'Entrante',
    contenido: body   // en lugar de content
  });

  // 4) Respuesta automática
  return 'Gracias por tu mensaje. En breve te atenderemos.';
}

module.exports = handleIncomingMessage;