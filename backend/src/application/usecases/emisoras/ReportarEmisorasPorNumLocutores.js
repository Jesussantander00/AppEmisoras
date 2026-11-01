/**
 * Reporte parametrizado 2 de Emisoras: emisoras con numLocutores >= minimo (parametro: minimo).
 */
class ReportarEmisorasPorNumLocutores {
  constructor(emisoraRepository) {
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar(minimo) {
    const todas = await this.emisoraRepository.findAll();
    const min = Number(minimo);
    if (Number.isNaN(min)) {
      const err = new Error("El parametro minimo debe ser numerico");
      err.statusCode = 400;
      throw err;
    }
    return todas.filter((e) => Number(e.numLocutores) >= min);
  }
}

module.exports = ReportarEmisorasPorNumLocutores;
