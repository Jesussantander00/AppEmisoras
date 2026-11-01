/**
 * Reporte parametrizado 1 de Programas: todos los programas de una emisora (parametro: emisoraId).
 */
class ReportarProgramasPorEmisora {
  constructor(programaRepository) {
    this.programaRepository = programaRepository;
  }

  async ejecutar(emisoraId) {
    return this.programaRepository.findByEmisoraId(emisoraId);
  }
}

module.exports = ReportarProgramasPorEmisora;
