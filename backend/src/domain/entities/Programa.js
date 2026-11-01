/**
 * Entidad de dominio: Programa.
 * emisoraId es la llave foranea hacia Emisora (relacion 1 a muchos).
 */
class Programa {
  constructor({
    id,
    nombre,
    emisoraId,
    conductor,
    horarioInicio,
    horarioFin,
    genero,
    duracionMinutos,
    descripcion,
    diasTransmision,
  }) {
    if (!id || String(id).trim() === "") {
      throw new Error("El campo id es obligatorio");
    }
    if (!nombre || String(nombre).trim() === "") {
      throw new Error("El campo nombre es obligatorio");
    }
    if (!emisoraId || String(emisoraId).trim() === "") {
      throw new Error("El campo emisoraId es obligatorio");
    }

    this.id = String(id);
    this.nombre = String(nombre);
    this.emisoraId = String(emisoraId);
    this.conductor = conductor ?? "";
    this.horarioInicio = horarioInicio ?? "";
    this.horarioFin = horarioFin ?? "";
    this.genero = genero ?? "";
    this.duracionMinutos = duracionMinutos ?? "";
    this.descripcion = descripcion ?? "";
    this.diasTransmision = diasTransmision ?? "";
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      emisoraId: this.emisoraId,
      conductor: this.conductor,
      horarioInicio: this.horarioInicio,
      horarioFin: this.horarioFin,
      genero: this.genero,
      duracionMinutos: this.duracionMinutos,
      descripcion: this.descripcion,
      diasTransmision: this.diasTransmision,
    };
  }
}

module.exports = Programa;
