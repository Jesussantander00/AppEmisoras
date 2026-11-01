/**
 * Entidad de dominio: Usuario (para login / registro / recuperacion de clave).
 * El campo se llama "clave" (no "password") para ser compatible con los
 * registros ya existentes en Firebase (usuarios/{correo} -> {nombre, email, clave})
 * y con los bloques de Kodular, que ya usaban ese nombre.
 */
class Usuario {
  constructor({ email, clave, nombre }) {
    if (!email || String(email).trim() === "") {
      throw new Error("El campo email es obligatorio");
    }
    if (!clave || String(clave).trim() === "") {
      throw new Error("El campo clave es obligatorio");
    }
    this.email = String(email).trim().toLowerCase();
    this.clave = String(clave);
    this.nombre = nombre ?? "";
  }

  toJSON() {
    return { email: this.email, nombre: this.nombre, clave: this.clave };
  }

  toPublicJSON() {
    return { email: this.email, nombre: this.nombre };
  }
}

module.exports = Usuario;
