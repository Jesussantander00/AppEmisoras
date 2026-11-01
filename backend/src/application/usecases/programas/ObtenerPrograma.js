class ObtenerPrograma {
  constructor(programaRepository) {
    this.programaRepository = programaRepository;
  }

  async ejecutar(id) {
    const programa = await this.programaRepository.findById(id);
    if (!programa) {
      const err = new Error(`No existe un programa con id ${id}`);
      err.statusCode = 404;
      throw err;
    }
    return programa;
  }
}

module.exports = ObtenerPrograma;
