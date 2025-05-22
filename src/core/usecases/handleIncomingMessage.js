/**
 * Caso de uso: procesa un mensaje entrante de Twilio
 * - Busca o crea el cliente
 * - Busca o crea la sesión activa
 * - Guarda el mensaje
 * - Retorna respuesta de texto
 */
async function handleIncomingMessage({ from, body }, { customerRepo, sessionRepo, messageRepo }) {
  // 1) Cliente
  let customer = await customerRepo.findByPhoneNumber(from);
  if (!customer) {
    customer = await customerRepo.create({ name: null, phoneNumber: from, type: 'NEW' });
  }

  // 2) Sesión
  let session = await sessionRepo.findActiveByCustomerId(customer.id);
  if (!session) {
    session = await sessionRepo.create({ customerId: customer.id });
  }

  // 3) Mensaje
  await messageRepo.save({
    sessionId: session.id,
    direction: 'INBOUND',
    content: body
  });

  // 4) Respuesta
  return 'Gracias por tu mensaje. En breve te atenderemos.';
}

module.exports = handleIncomingMessage;