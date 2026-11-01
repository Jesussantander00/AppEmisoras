const UsuarioRepository = require("../../../domain/ports/UsuarioRepository");

class InMemoryUsuarioRepository extends UsuarioRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async findByEmail(email) {
    return this.data.get(String(email).trim().toLowerCase()) || null;
  }

  async save(usuario) {
    this.data.set(usuario.email, usuario);
    return usuario;
  }
}

module.exports = InMemoryUsuarioRepository;
