class ListarProgramas {
  constructor(programaRepository) {
    this.programaRepository = programaRepository;
  }

  async ejecutar() {
    return this.programaRepository.findAll();
  }
}

module.exports = ListarProgramas;
