class EliminarEmisora {
  constructor(emisoraRepository) {
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar(id) {
    await this.emisoraRepository.deleteById(id);
    return { id };
  }
}

module.exports = EliminarEmisora;
