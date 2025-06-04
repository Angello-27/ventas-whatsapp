// infrastructure/db/MysqlImagenProductoRepository.js

const IImagenRepository = require('../../core/repositories/IImagenRepository');
const Imagen = require('../../core/entities/Imagen');
const pool = require('./mysqlPool');

class MysqlImagenProductoRepository extends IImagenRepository {
    /**
     * Devuelve todas las imágenes asociadas a una variante.
     * @param {number} varianteId
     * @returns {Promise<Imagen[]>}
     */
    async findByVarianteId(varianteId) {
        const [rows] = await pool.query(
            `SELECT ImagenId, VarianteId, Url, EsPrincipal AS esPrincipal, createdAt, updatedAt
         FROM productoimagenes
         WHERE VarianteId = ? AND isActive = 1`,
            [varianteId]
        );
        return rows.map(r => new Imagen({
            imagenId: r.ImagenId,
            varianteId: r.VarianteId,
            url: r.Url,
            esPrincipal: Boolean(r.esPrincipal),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));
    }

    /**
     * Devuelve la imagen principal (esPrincipal = 1) de una variante (o null si no existe).
     * @param {number} varianteId
     * @returns {Promise<Imagen|null>}
     */
    async findPrincipalByVariante(varianteId) {
        const [rows] = await pool.query(
            `SELECT ImagenId, VarianteId, Url, EsPrincipal AS esPrincipal, createdAt, updatedAt
         FROM productoimagenes
         WHERE VarianteId = ? AND EsPrincipal = 1 AND isActive = 1
         LIMIT 1`,
            [varianteId]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return new Imagen({
            imagenId: r.ImagenId,
            varianteId: r.VarianteId,
            url: r.Url,
            esPrincipal: Boolean(r.esPrincipal),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        });
    }

    /**
     * Guarda o actualiza una imagen.
     * @param {{
     *   imagenId?: number,
     *   varianteId: number,
     *   url: string,
     *   esPrincipal?: boolean
     * }} data
     * @returns {Promise<Imagen>}
     */
    async saveOrUpdate({ imagenId, varianteId, url, esPrincipal = false }) {
        if (imagenId) {
            // Si se marca como principal, primero desmarcamos las otras
            if (esPrincipal) {
                await pool.query(
                    `UPDATE productoimagenes
             SET EsPrincipal = 0, updatedAt = NOW()
           WHERE VarianteId = ?`,
                    [varianteId]
                );
            }
            // Actualizar fila
            await pool.query(
                `UPDATE productoimagenes
           SET VarianteId = ?, Url = ?, EsPrincipal = ?, updatedAt = NOW()
         WHERE ImagenId = ?`,
                [varianteId, url, esPrincipal ? 1 : 0, imagenId]
            );
            return this.findByVarianteId(varianteId).then(list =>
                list.find(img => img.imagenId === imagenId) || null
            );
        } else {
            // Si se va a insertar y esPrincipal=true, desmarcamos otras primero
            if (esPrincipal) {
                await pool.query(
                    `UPDATE productoimagenes
             SET EsPrincipal = 0, updatedAt = NOW()
           WHERE VarianteId = ?`,
                    [varianteId]
                );
            }
            // Insertar nueva fila
            const [result] = await pool.query(
                `INSERT INTO productoimagenes (VarianteId, Url, EsPrincipal, createdAt, updatedAt)
           VALUES (?, ?, ?, NOW(), NOW())`,
                [varianteId, url, esPrincipal ? 1 : 0]
            );
            const insertId = result.insertId;
            return this.findPrincipalByVariante(varianteId);
        }
    }
}

module.exports = MysqlImagenProductoRepository;
