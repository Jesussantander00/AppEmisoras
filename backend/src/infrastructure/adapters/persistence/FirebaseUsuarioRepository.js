const UsuarioRepository = require("../../../domain/ports/UsuarioRepository");
const Usuario = require("../../../domain/entities/Usuario");

function normalizarCorreo(email) {
  // Firebase no permite '.' ni '@' como parte de una llave.
  return String(email).trim().toLowerCase().replace(/@/g, "_at_").replace(/\./g, "_dot_");
}

class FirebaseUsuarioRepository extends UsuarioRepository {
  constructor(firebaseClient) {
    super();
    this.client = firebaseClient;
  }

  async findByEmail(email) {
    const data = await this.client.get(`usuarios/${normalizarCorreo(email)}`);
    if (!data) return null;
    return new Usuario(data);
  }

  async save(usuario) {
    await this.client.put(`usuarios/${normalizarCorreo(usuario.email)}`, usuario.toJSON());
    return usuario;
  }
}

module.exports = FirebaseUsuarioRepository;
