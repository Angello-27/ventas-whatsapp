/**
 * Entidad Customer
 */
class Customer {
  constructor({ id, name, phoneNumber, type, registeredAt }) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.type = type;            // 'NEW', 'REGISTERED', 'COMPANY_USER'
    this.registeredAt = registeredAt; // Date
  }
}

module.exports = Customer;