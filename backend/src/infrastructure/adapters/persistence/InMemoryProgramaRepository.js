const ProgramaRepository = require("../../../domain/ports/ProgramaRepository");

class InMemoryProgramaRepository extends ProgramaRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async findAll() {
    return Array.from(this.data.values());
  }

  async findById(id) {
    return this.data.get(String(id)) || null;
  }

  async findByEmisoraId(emisoraId) {
    return Array.from(this.data.values()).filter((p) => p.emisoraId === String(emisoraId));
  }

  async save(programa) {
    this.data.set(programa.id, programa);
    return programa;
  }

  async deleteById(id) {
    this.data.delete(String(id));
  }
}

module.exports = InMemoryProgramaRepository;
