class ObtenerEmisora {
  constructor(emisoraRepository) {
    this.emisoraRepository = emisoraRepository;
  }

  async ejecutar(id) {
    const emisora = await this.emisoraRepository.findById(id);
    if (!emisora) {
      const err = new Error(`No existe una emisora con id ${id}`);
      err.statusCode = 404;
      throw err;
    }
    return emisora;
  }
}

module.exports = ObtenerEmisora;
