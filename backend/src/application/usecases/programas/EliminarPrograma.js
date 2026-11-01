class EliminarPrograma {
  constructor(programaRepository) {
    this.programaRepository = programaRepository;
  }

  async ejecutar(id) {
    await this.programaRepository.deleteById(id);
    return { id };
  }
}

module.exports = EliminarPrograma;
