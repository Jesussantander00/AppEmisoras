const Programa = require("../../../domain/entities/Programa");

class GuardarPrograma {
  constructor(programaRepository, emisoraRepository) {
    this.programaRepository = programaRepository;
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar(datos) {
    const programa = new Programa(datos); // valida reglas de dominio

    // Regla de integridad referencial: la emisora referenciada debe existir.
    const emisora = await this.emisoraRepository.findById(programa.emisoraId);
    if (!emisora) {
      const err = new Error(`No existe una emisora con id ${programa.emisoraId}`);
      err.statusCode = 400;
      throw err;
    }

    await this.programaRepository.save(programa);
    return programa;
  }
}

module.exports = GuardarPrograma;
