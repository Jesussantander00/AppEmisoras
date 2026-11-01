const fetch = require("node-fetch");

/**
 * Cliente minimo para hablar con Firebase Realtime Database via su API REST.
 * Es un detalle de infraestructura: los casos de uso nunca lo tocan
 * directamente, solo a traves de los repositorios (adaptadores) que lo usan.
 */
class FirebaseClient {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error("FIREBASE_BASE_URL no esta configurada");
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async get(path) {
    const res = await fetch(`${this.baseUrl}/${path}.json`);
    if (!res.ok) {
      throw new Error(`Firebase GET ${path} fallo con status ${res.status}`);
    }
    return res.json();
  }

  async put(path, data) {
    const res = await fetch(`${this.baseUrl}/${path}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Firebase PUT ${path} fallo con status ${res.status}`);
    }
    return res.json();
  }

  async delete(path) {
    const res = await fetch(`${this.baseUrl}/${path}.json`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`Firebase DELETE ${path} fallo con status ${res.status}`);
    }
    return res.json();
  }
}

module.exports = FirebaseClient;
