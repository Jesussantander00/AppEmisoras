const Usuario = require("../../../domain/entities/Usuario");

class RegistrarUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(datos) {
    const usuario = new Usuario(datos);
    const existente = await this.usuarioRepository.findByEmail(usuario.email);
    if (existente) {
      const err = new Error("Ya existe una cuenta registrada con ese correo");
      err.statusCode = 409;
      throw err;
    }
    await this.usuarioRepository.save(usuario);
    return usuario.toPublicJSON();
  }
}

module.exports = RegistrarUsuario;
