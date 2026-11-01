const ProgramaRepository = require("../../../domain/ports/ProgramaRepository");
const Programa = require("../../../domain/entities/Programa");

class FirebaseProgramaRepository extends ProgramaRepository {
  constructor(firebaseClient) {
    super();
    this.client = firebaseClient;
  }

  async findAll() {
    const data = await this.client.get("programas");
    if (!data) return [];
    return Object.values(data)
      .filter((d) => d && d.id && d.nombre && d.emisoraId) // ignora registros de prueba incompletos
      .map((d) => new Programa(d));
  }

  async findById(id) {
    const data = await this.client.get(`programas/${id}`);
    if (!data) return null;
    return new Programa(data);
  }

  async findByEmisoraId(emisoraId) {
    const todos = await this.findAll();
    return todos.filter((p) => p.emisoraId === String(emisoraId));
  }

  async save(programa) {
    await this.client.put(`programas/${programa.id}`, programa.toJSON());
    return programa;
  }

  async deleteById(id) {
    await this.client.delete(`programas/${id}`);
  }
}

module.exports = FirebaseProgramaRepository;
