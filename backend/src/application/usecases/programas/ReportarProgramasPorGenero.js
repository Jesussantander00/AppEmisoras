/**
 * Reporte parametrizado 2 de Programas: programas por genero (parametro: genero).
 */
class ReportarProgramasPorGenero {
  constructor(programaRepository) {
    this.programaRepository = programaRepository;
  }

  async ejecutar(genero) {
    const todos = await this.programaRepository.findAll();
    const buscado = String(genero || "").trim().toLowerCase();
    return todos.filter((p) => String(p.genero || "").trim().toLowerCase() === buscado);
  }
}

module.exports = ReportarProgramasPorGenero;
