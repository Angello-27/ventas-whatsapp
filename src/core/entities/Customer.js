/**
 * Entidad Customer (cliente)
 */
class Customer {
  constructor({ id, name, phoneNumber, email, address, type, registeredAt }) {
    this.id          = id;
    this.name        = name;
    this.phoneNumber = phoneNumber;
    this.email       = email;
    this.address     = address;
    this.type        = type;        // 'Nuevo', 'Registrado', 'Empresa'
    this.registeredAt= registeredAt;
  }
}

module.exports = Customer;