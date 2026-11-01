/**
 * Puerto (interfaz) de salida: contrato que debe cumplir cualquier adaptador
 * de persistencia para Emisoras (Firebase, Mongo, memoria, etc.).
 * Esta clase nunca se instancia directamente; solo documenta el contrato.
 */
class EmisoraRepository {
  async findAll() {
    throw new Error("No implementado");
  }
  async findById(id) {
    throw new Error("No implementado");
  }
  async save(emisora) {
    throw new Error("No implementado");
  }
  async deleteById(id) {
    throw new Error("No implementado");
  }
}

module.exports = EmisoraRepository;
