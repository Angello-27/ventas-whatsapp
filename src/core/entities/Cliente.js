class Cliente {
  constructor({ 
    id, nombre, sexo, telefono, email, direccion, tipoCliente, 
    createdAt, updatedAt, isActive 
  }) {
    this.id           = id;           // ClienteId
    this.nombre       = nombre;       // Nombre
    this.sexo         = sexo;         // Sexo
    this.telefono     = telefono;     // Telefono
    this.email        = email;        // Email
    this.direccion    = direccion;    // Direccion
    this.tipoCliente  = tipoCliente;  // TipoCliente
    this.createdAt    = createdAt;
    this.updatedAt    = updatedAt;
    this.isActive     = Boolean(isActive);
  }
}

module.exports = Cliente;
