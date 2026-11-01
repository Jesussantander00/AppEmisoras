class IniciarSesion {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar({ email, clave }) {
    const correo = String(email || "").trim().toLowerCase();
    const usuario = await this.usuarioRepository.findByEmail(correo);
    if (!usuario || usuario.clave !== clave) {
      const err = new Error("Correo o clave incorrectos");
      err.statusCode = 401;
      throw err;
    }
    return usuario.toPublicJSON ? usuario.toPublicJSON() : { email: usuario.email, nombre: usuario.nombre };
  }
}

module.exports = IniciarSesion;
