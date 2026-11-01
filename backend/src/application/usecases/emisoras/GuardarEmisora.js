const Emisora = require("../../../domain/entities/Emisora");

/**
 * Caso de uso: crear o actualizar (upsert) una Emisora.
 * Depende solo del puerto EmisoraRepository, nunca de Firebase directamente.
 */
class GuardarEmisora {
  constructor(emisoraRepository) {
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar(datos) {
    const emisora = new Emisora(datos); // valida reglas de dominio (id y nombre obligatorios)
    await this.emisoraRepository.save(emisora);
    return emisora;
  }
}

module.exports = GuardarEmisora;
