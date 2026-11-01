/**
 * Reporte parametrizado 1 de Emisoras: por pais (parametro: pais).
 */
class ReportarEmisorasPorPais {
  constructor(emisoraRepository) {
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar(pais) {
    const todas = await this.emisoraRepository.findAll();
    const buscado = String(pais || "").trim().toLowerCase();
    return todas.filter((e) => String(e.pais || "").trim().toLowerCase() === buscado);
  }
}

module.exports = ReportarEmisorasPorPais;
