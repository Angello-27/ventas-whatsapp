const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig');
const pool = mysql.createPool(dbConfig);

class VistaProductoHierarchyRepository {
    /**
     * Datos de producto + marca + proveedor + categoría.
     */
    async findByProductoId(productoId) {
        const [rows] = await pool.query(
            `SELECT
         ProductoId        AS productoId,
         ProductoNombre    AS productoNombre,
         MarcaId           AS marcaId,
         MarcaNombre       AS marcaNombre,
         ProveedorId       AS proveedorId,
         ProveedorNombre   AS proveedorNombre,
         CategoriaId       AS categoriaId,
         CategoriaNombre   AS categoriaNombre,
         PadreCategoriaId  AS padreCategoriaId
       FROM v_producto_hierarchy
       WHERE ProductoId = ?`,
            [productoId]
        );
        return rows.length ? rows[0] : null;
    }
}

module.exports = VistaProductoHierarchyRepository;
