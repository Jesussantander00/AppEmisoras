class ListarEmisoras {
  constructor(emisoraRepository) {
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar() {
    return this.emisoraRepository.findAll();
  }
}

module.exports = ListarEmisoras;
