const EmisoraRepository = require("../../../domain/ports/EmisoraRepository");
const Emisora = require("../../../domain/entities/Emisora");

/**
 * Adaptador de salida: implementa el puerto EmisoraRepository hablando con
 * Firebase Realtime Database por REST. Es intercambiable por cualquier otra
 * implementacion (Mongo, Postgres, memoria) sin tocar los casos de uso.
 */
class FirebaseEmisoraRepository extends EmisoraRepository {
  constructor(firebaseClient) {
    super();
    this.client = firebaseClient;
  }

  async findAll() {
    const data = await this.client.get("emisoras");
    if (!data) return [];
    return Object.values(data).map((d) => new Emisora(d));
  }

  async findById(id) {
    const data = await this.client.get(`emisoras/${id}`);
    if (!data) return null;
    return new Emisora(data);
  }

  async save(emisora) {
    await this.client.put(`emisoras/${emisora.id}`, emisora.toJSON());
    return emisora;
  }

  async deleteById(id) {
    await this.client.delete(`emisoras/${id}`);
  }
}

module.exports = FirebaseEmisoraRepository;
