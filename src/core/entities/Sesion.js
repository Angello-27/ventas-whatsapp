class Sesion {
    constructor({
        sesionId,
        clienteId,
        iniciadoEn = null,
        finalizadoEn = null,
        ultimoContexto = null,
        createdAt = null,
        isActive = true
    }) {
        this.sesionId = sesionId;
        this.clienteId = clienteId;
        this.iniciadoEn = iniciadoEn;
        this.finalizadoEn = finalizadoEn;
        this.ultimoContexto = ultimoContexto;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }

    /**
     * Obtiene el contexto de la sesión como objeto
     * @returns {object|null}
     */
    getContexto() {
        console.log('🔍 getContexto llamado, ultimoContexto:', this.ultimoContexto);

        if (!this.ultimoContexto) {
            console.log('🧠 Sin contexto en la sesión');
            return null;
        }

        // Si es un objeto JSON de MySQL, ya está parseado
        if (typeof this.ultimoContexto === 'object') {
            console.log('🧠 Contexto como objeto JSON:', this.ultimoContexto);
            return this.ultimoContexto;
        }

        // Si es string, intentar parsear
        if (typeof this.ultimoContexto === 'string') {
            try {
                const parsed = JSON.parse(this.ultimoContexto);
                console.log('🧠 Contexto parseado desde string:', parsed);
                return parsed;
            } catch (error) {
                console.warn('⚠️ Error parseando contexto JSON:', error);
                return null;
            }
        }

        return null;
    }

    /**
     * Establece el contexto de la sesión
     * @param {object} contextObj - Objeto de contexto
     */
    setContexto(contextObj) {
        console.log('🔍 setContexto llamado con:', contextObj);

        if (!contextObj) {
            console.log('🧠 Limpiando contexto de sesión');
            this.ultimoContexto = null;
            return;
        }

        // Para MySQL con columna JSON, podemos guardar directamente el objeto
        if (typeof contextObj === 'object') {
            this.ultimoContexto = contextObj; // MySQL JSON column maneja esto
            console.log('🧠 Contexto establecido como objeto:', {
                tipo: contextObj.lastType,
                items: contextObj.lastItems?.length || 0,
                query: contextObj.lastQuery
            });
        } else {
            this.ultimoContexto = contextObj;
            console.log('🧠 Contexto establecido como:', typeof contextObj);
        }
    }

    /**
     * Verifica si la sesión tiene contexto
     * @returns {boolean}
     */
    hasContexto() {
        return !!this.ultimoContexto;
    }

    /**
     * Limpia el contexto de la sesión
     */
    clearContexto() {
        console.log('🧹 Limpiando contexto de sesión');
        this.ultimoContexto = null;
    }
}

module.exports = Sesion;