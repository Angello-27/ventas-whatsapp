/**
 * Caso de uso: procesa un mensaje entrante de WhatsApp
 */
async function handleIncomingMessage(
  { from, body },
  { customerRepo, sessionRepo, messageRepo }
) {
  // 1) Cliente: busca por teléfono o crea uno nuevo
  let customer = await customerRepo.findByTelefono(from);
  if (!customer) {
    customer = await customerRepo.create({
      name: null,
      phoneNumber: from,
      email: null,
      address: null,
      type: 'Nuevo'
    });
  }

  // 2) Sesión: busca sesión activa o crea una nueva
  let session = await sessionRepo.findActiveByClienteId(customer.id);
  if (!session) {
    session = await sessionRepo.create({ customerId: customer.id });
  }

  // 3) Mensaje: guarda como 'Entrante'
  await messageRepo.save({
    sessionId: session.id,
    direction: 'Entrante',
    content: body
  });

  // 4) Respuesta automática
  return 'Gracias por tu mensaje. En breve te atenderemos.';
}

module.exports = handleIncomingMessage;