/**
 * Caso de uso: recuperar clave por email.
 * El backend valida que el correo exista y devuelve los datos necesarios
 * para que la app movil abra el cliente de correo del dispositivo con la
 * contrasena (igual que en Corte 1). Si mas adelante se quiere enviar el
 * correo directamente desde el servidor, aqui es donde se conectaria un
 * adaptador de salida tipo "EmailSender" (Nodemailer, SendGrid, etc.).
 */
class RecuperarClave {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(email) {
    const correo = String(email || "").trim().toLowerCase();
    const usuario = await this.usuarioRepository.findByEmail(correo);
    if (!usuario) {
      const err = new Error("No existe una cuenta registrada con ese correo");
      err.statusCode = 404;
      throw err;
    }
    return { email: usuario.email, nombre: usuario.nombre, clave: usuario.clave };
  }
}

module.exports = RecuperarClave;
