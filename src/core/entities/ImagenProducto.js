class ImagenProducto {
  constructor({ id, productoId, url, createdAt, updatedAt, isActive }) {
    this.id         = id;         // ImagenId
    this.productoId = productoId; // ProductoId
    this.url        = url;        // Url
    this.createdAt  = createdAt;
    this.updatedAt  = updatedAt;
    this.isActive   = Boolean(isActive);
  }
}

module.exports = ImagenProducto;
