/**
 * Convierte una lista de entidades en un objeto {id: {...}}, igual a como
 * Firebase Realtime Database devuelve una coleccion. Se usa en las
 * respuestas HTTP que antes Kodular esperaba en ese formato (listados y
 * reportes), para no tener que reescribir los bloques de Kodular que ya
 * sabian leer esa forma.
 */
function listaAObjeto(entidades) {
  const resultado = {};
  for (const entidad of entidades) {
    const json = typeof entidad.toJSON === "function" ? entidad.toJSON() : entidad;
    resultado[json.id] = json;
  }
  return resultado;
}

module.exports = listaAObjeto;
