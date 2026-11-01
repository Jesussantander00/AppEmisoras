/**
 * Entidad de dominio: Emisora.
 * No depende de Express, Firebase ni ningun framework (capa de dominio pura).
 */
class Emisora {
  constructor({
    id,
    nombre,
    canal,
    bandaFM,
    bandaAM,
    numLocutores,
    genero,
    horario,
    patrocinador,
    pais,
    descripcion,
    numPrograma,
    numCiudades,
  }) {
    if (!id || String(id).trim() === "") {
      throw new Error("El campo id es obligatorio");
    }
    if (!nombre || String(nombre).trim() === "") {
      throw new Error("El campo nombre es obligatorio");
    }

    this.id = String(id);
    this.nombre = String(nombre);
    this.canal = canal ?? "";
    this.bandaFM = bandaFM ?? "";
    this.bandaAM = bandaAM ?? "";
    this.numLocutores = numLocutores ?? "";
    this.genero = genero ?? "";
    this.horario = horario ?? "";
    this.patrocinador = patrocinador ?? "";
    this.pais = pais ?? "";
    this.descripcion = descripcion ?? "";
    this.numPrograma = numPrograma ?? "";
    this.numCiudades = numCiudades ?? "";
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      canal: this.canal,
      bandaFM: this.bandaFM,
      bandaAM: this.bandaAM,
      numLocutores: this.numLocutores,
      genero: this.genero,
      horario: this.horario,
      patrocinador: this.patrocinador,
      pais: this.pais,
      descripcion: this.descripcion,
      numPrograma: this.numPrograma,
      numCiudades: this.numCiudades,
    };
  }
}

module.exports = Emisora;
