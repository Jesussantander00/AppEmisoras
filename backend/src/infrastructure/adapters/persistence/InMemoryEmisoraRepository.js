const EmisoraRepository = require("../../../domain/ports/EmisoraRepository");

/**
 * Adaptador de salida alterno, solo para pruebas locales (no usa red).
 * Implementa el mismo puerto que FirebaseEmisoraRepository.
 */
class InMemoryEmisoraRepository extends EmisoraRepository {
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

  async save(emisora) {
    this.data.set(emisora.id, emisora);
    return emisora;
  }

  async deleteById(id) {
    this.data.delete(String(id));
  }
}

module.exports = InMemoryEmisoraRepository;
